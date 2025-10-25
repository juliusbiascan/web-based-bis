"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

const MODEL_URL = "/models";
const HEAD_TURN_THRESHOLD = 15; // degrees
const FRAMES_TO_CONFIRM = 5; // frames needed to confirm a pose
const CENTER_THRESHOLD = 10; // degrees from center

let modelLoadPromise: Promise<void> | null = null;
let modelsReady = false;

async function ensureModelsLoaded() {
  if (modelsReady) return;

  if (!modelLoadPromise) {
    modelLoadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]).then(() => {
      modelsReady = true;
    }).catch((error) => {
      modelLoadPromise = null;
      throw error;
    });
  }

  await modelLoadPromise;
}

// Calculate head pose angle from landmarks
function calculateHeadPose(landmarks: faceapi.FaceLandmarks68) {
  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  if (nose.length === 0 || leftEye.length === 0 || rightEye.length === 0) {
    return 0;
  }

  // Get nose tip and bridge points
  const noseTip = nose[3];
  const noseBridge = nose[0];

  // Get eye centers
  const leftEyeCenter = leftEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  leftEyeCenter.x /= leftEye.length;
  leftEyeCenter.y /= leftEye.length;

  const rightEyeCenter = rightEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  rightEyeCenter.x /= rightEye.length;
  rightEyeCenter.y /= rightEye.length;

  // Calculate eye midpoint
  const eyeMidpoint = {
    x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
    y: (leftEyeCenter.y + rightEyeCenter.y) / 2
  };

  // Calculate horizontal offset from nose to eye midpoint
  const horizontalOffset = noseTip.x - eyeMidpoint.x;
  const eyeDistance = Math.abs(rightEyeCenter.x - leftEyeCenter.x);

  // Convert to angle (approximation)
  const angle = (horizontalOffset / eyeDistance) * 45; // rough conversion to degrees

  return angle;
}

function calculateEAR(eye: faceapi.Point[]) {
  if (eye.length < 6) {
    return 0;
  }
  const distance = (p1: faceapi.Point, p2: faceapi.Point) =>
    Math.hypot(p1.x - p2.x, p1.y - p2.y);

  const vertical1 = distance(eye[1], eye[5]);
  const vertical2 = distance(eye[2], eye[4]);
  const horizontal = distance(eye[0], eye[3]);

  return (vertical1 + vertical2) / (2.0 * horizontal || 1);
}

interface FaceLivenessCaptureProps {
  value?: string;
  onChange: (value: string | null) => void;
}

export function FaceLivenessCapture({ value, onChange }: FaceLivenessCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Head pose tracking
  const currentStepRef = useRef<'left' | 'right' | 'center' | 'complete'>('left');
  const poseFrameCounterRef = useRef(0);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("faceImageUploader");
  const [statusMessage, setStatusMessage] = useState<string>(
    "Click start to run face liveness detection."
  );
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const stopCapture = useCallback(() => {
    setIsCapturing(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    currentStepRef.current = 'left';
    poseFrameCounterRef.current = 0;
    setDebugInfo(null);
    if (overlayCanvasRef.current) {
      const overlayContext = overlayCanvasRef.current.getContext("2d");
      if (overlayContext && overlayCanvasRef.current.width && overlayCanvasRef.current.height) {
        overlayContext.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadModels = async () => {
      try {
        await ensureModelsLoaded();
        if (active) {
          setModelsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load face-api models", error);
        toast.error("Unable to load face detection models. Please refresh the page.");
      }
    };

    loadModels();

    return () => {
      active = false;
      stopCapture();
    };
  }, [stopCapture]);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Unable to capture image. Please try again.");
      return;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    setIsUploading(true);

    try {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((blobResult) => resolve(blobResult), "image/png", 0.92)
      );

      if (!blob) {
        throw new Error("Failed to capture frame");
      }

      const file = new File([blob], `face-liveness-${Date.now()}.png`, { type: "image/png" });
      const response = await startUpload([file]);

      if (response?.[0]?.url) {
        onChange(response[0].url);
        toast.success("Face liveness verification successful!");
      } else {
        throw new Error("Upload failed");
      }

      setStatusMessage("Face liveness verification completed.");
    } catch (error) {
      console.error("Capture/upload error", error);
      toast.error("Failed to capture face image. Please try again.");
      setStatusMessage("Capture failed. Click start to try again.");
    } finally {
      setIsUploading(false);
      stopCapture();
    }
  }, [onChange, startUpload, stopCapture]);

  const drawOverlay = useCallback(
    (detection?: faceapi.WithFaceLandmarks<any> | null, currentStep?: string) => {
      const overlay = overlayCanvasRef.current;
      const video = videoRef.current;
      if (!overlay || !video) {
        return;
      }

      const displaySize = {
        width: video.videoWidth || 640,
        height: video.videoHeight || 480
      };

      const context = overlay.getContext("2d");
      if (!context) {
        return;
      }

      context.clearRect(0, 0, overlay.width, overlay.height);

      const centerX = overlay.width / 2;
      const centerY = overlay.height / 2;
      const radius = Math.min(overlay.width, overlay.height) * 0.35;

      // Draw semi-transparent overlay
      context.fillStyle = "rgba(17, 24, 39, 0.45)";
      context.fillRect(0, 0, overlay.width, overlay.height);

      // Cut out center circle
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = "source-over";

      // Draw main circle guide
      context.strokeStyle = "rgba(255, 255, 255, 0.85)";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();

      // Draw directional guide based on current step
      const arrowOffset = radius * 1.3;
      const arrowSize = 30;

      context.fillStyle = "rgba(59, 130, 246, 0.9)";
      context.strokeStyle = "rgba(255, 255, 255, 0.9)";
      context.lineWidth = 2;

      if (currentStep === 'left') {
        // Left arrow
        const leftX = centerX - arrowOffset;
        context.beginPath();
        context.moveTo(leftX, centerY);
        context.lineTo(leftX + arrowSize, centerY - arrowSize / 2);
        context.lineTo(leftX + arrowSize, centerY + arrowSize / 2);
        context.closePath();
        context.fill();
        context.stroke();

        // "TURN LEFT" text
        context.font = "bold 20px sans-serif";
        context.fillStyle = "rgba(59, 130, 246, 1)";
        context.textAlign = "center";
        context.fillText("◄ TURN LEFT", centerX, centerY - radius - 40);
      } else if (currentStep === 'right') {
        // Right arrow
        const rightX = centerX + arrowOffset;
        context.beginPath();
        context.moveTo(rightX, centerY);
        context.lineTo(rightX - arrowSize, centerY - arrowSize / 2);
        context.lineTo(rightX - arrowSize, centerY + arrowSize / 2);
        context.closePath();
        context.fill();
        context.stroke();

        // "TURN RIGHT" text
        context.font = "bold 20px sans-serif";
        context.fillStyle = "rgba(59, 130, 246, 1)";
        context.textAlign = "center";
        context.fillText("TURN RIGHT ►", centerX, centerY - radius - 40);
      } else if (currentStep === 'center') {
        // Center target
        context.strokeStyle = "rgba(34, 197, 94, 0.9)";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(centerX, centerY, 20, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.moveTo(centerX - 30, centerY);
        context.lineTo(centerX + 30, centerY);
        context.moveTo(centerX, centerY - 30);
        context.lineTo(centerX, centerY + 30);
        context.stroke();

        // "LOOK CENTER" text
        context.font = "bold 20px sans-serif";
        context.fillStyle = "rgba(34, 197, 94, 1)";
        context.textAlign = "center";
        context.fillText("● LOOK CENTER ●", centerX, centerY - radius - 40);
      }

      // Draw crosshair guides
      context.strokeStyle = "rgba(255, 255, 255, 0.2)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(centerX, centerY - radius);
      context.lineTo(centerX, centerY + radius);
      context.moveTo(centerX - radius * 0.6, centerY);
      context.lineTo(centerX + radius * 0.6, centerY);
      context.stroke();
    },
    []
  );

  const runDetection = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded) {
      return;
    }

    const video = videoRef.current;

    try {
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        setDebugInfo("Waiting for video to initialize...");
        animationFrameRef.current = requestAnimationFrame(runDetection);
        return;
      }

      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.2 })
        )
        .withFaceLandmarks();

      if (!isCapturing) {
        return;
      }

      drawOverlay(detection ?? null, currentStepRef.current);

      if (detection) {
        const headAngle = calculateHeadPose(detection.landmarks);

        let currentPoseStatus = '';

        // Determine current head pose
        if (headAngle < -HEAD_TURN_THRESHOLD) {
          currentPoseStatus = 'LEFT';
        } else if (headAngle > HEAD_TURN_THRESHOLD) {
          currentPoseStatus = 'RIGHT';
        } else if (Math.abs(headAngle) < CENTER_THRESHOLD) {
          currentPoseStatus = 'CENTER';
        }

        setDebugInfo(`Angle: ${headAngle.toFixed(1)}° | Pose: ${currentPoseStatus} | Step: ${currentStepRef.current.toUpperCase()}`);

        // State machine for head movement sequence
        if (currentStepRef.current === 'left') {
          if (currentPoseStatus === 'LEFT') {
            poseFrameCounterRef.current += 1;
            setStatusMessage(`Turn LEFT - Hold (${poseFrameCounterRef.current}/${FRAMES_TO_CONFIRM})`);

            if (poseFrameCounterRef.current >= FRAMES_TO_CONFIRM) {
              currentStepRef.current = 'right';
              poseFrameCounterRef.current = 0;
              setStatusMessage("Great! Now turn your head to the RIGHT");
              toast.success("Left pose confirmed!");
            }
          } else {
            poseFrameCounterRef.current = 0;
            setStatusMessage("Please turn your head to the LEFT");
          }
        } else if (currentStepRef.current === 'right') {
          if (currentPoseStatus === 'RIGHT') {
            poseFrameCounterRef.current += 1;
            setStatusMessage(`Turn RIGHT - Hold (${poseFrameCounterRef.current}/${FRAMES_TO_CONFIRM})`);

            if (poseFrameCounterRef.current >= FRAMES_TO_CONFIRM) {
              currentStepRef.current = 'center';
              poseFrameCounterRef.current = 0;
              setStatusMessage("Perfect! Now look straight at the camera");
              toast.success("Right pose confirmed!");
            }
          } else {
            poseFrameCounterRef.current = 0;
            setStatusMessage("Please turn your head to the RIGHT");
          }
        } else if (currentStepRef.current === 'center') {
          if (currentPoseStatus === 'CENTER') {
            poseFrameCounterRef.current += 1;
            setStatusMessage(`Look at CENTER - Hold (${poseFrameCounterRef.current}/${FRAMES_TO_CONFIRM})`);

            if (poseFrameCounterRef.current >= FRAMES_TO_CONFIRM) {
              currentStepRef.current = 'complete';
              setStatusMessage("Verification complete! Capturing...");
              toast.success("Center pose confirmed!");
              await captureFrame();
              return;
            }
          } else {
            poseFrameCounterRef.current = 0;
            setStatusMessage("Please look straight at the camera");
          }
        }
      } else {
        setStatusMessage("Face not detected. Center your face in the guide circle.");
        currentStepRef.current = 'left';
        poseFrameCounterRef.current = 0;
        setDebugInfo(null);
      }
    } catch (error) {
      console.error("Face detection error", error);
      setStatusMessage("Unable to analyze face. Please try again.");
      drawOverlay(null, currentStepRef.current);
      setDebugInfo(null);
    }

    animationFrameRef.current = requestAnimationFrame(runDetection);
  }, [captureFrame, drawOverlay, isCapturing, modelsLoaded]);

  const startCapture = useCallback(async () => {
    if (!modelsLoaded) {
      toast.message("Preparing models. Please wait a moment.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera access is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 60, max: 120 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaStreamRef.current = stream;
      setIsCapturing(true);
      setStatusMessage("Please turn your head to the LEFT");
      currentStepRef.current = 'left';
      poseFrameCounterRef.current = 0;
    } catch (error) {
      console.error("Camera access error", error);
      toast.error("Unable to access camera. Please allow camera permissions.");
    }
  }, [modelsLoaded]);

  const handleRetake = () => {
    onChange(null);
    setStatusMessage("Click start to run face liveness detection.");
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={() => {
            if (videoRef.current && overlayCanvasRef.current) {
              const displaySize = {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight
              };
              faceapi.matchDimensions(overlayCanvasRef.current, displaySize);
              animationFrameRef.current = requestAnimationFrame(runDetection);
            }
          }}
          className={`w-full ${isCapturing ? "block" : "hidden"}`}
        />
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 h-full w-full ${isCapturing ? "block" : "hidden"}`}
          style={{ pointerEvents: "none" }}
        />
        {!isCapturing && !value && (
          <div className="flex h-56 w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            {modelsLoaded ? (
              <>
                <Camera className="h-6 w-6" />
                <p>Start the liveness check to activate your camera.</p>
              </>
            ) : (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Loading face detection models...</p>
              </>
            )}
          </div>
        )}
        {value && !isCapturing && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Face liveness verified
            </div>
            <img
              src={value}
              alt="Captured face"
              className="max-h-48 w-full rounded-md object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetake}
              disabled={isUploading}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retake Verification
            </Button>
          </div>
        )}
      </div>

      {!value && (
        <>
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
          {debugInfo && (
            <p className="text-xs font-mono text-muted-foreground/80">{debugInfo}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={isCapturing ? undefined : startCapture}
              disabled={!modelsLoaded || isCapturing || isUploading}
            >
              {isCapturing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Capturing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Start Liveness Check
                </span>
              )}
            </Button>
            {isCapturing && (
              <Button type="button" variant="outline" onClick={stopCapture}>
                Cancel
              </Button>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
