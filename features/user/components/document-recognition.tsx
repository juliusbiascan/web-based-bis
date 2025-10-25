"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Camera, Loader2, RefreshCw } from "lucide-react";

interface DocumentRecognitionProps {
  frontValue?: string;
  backValue?: string;
  onFrontChange: (value: string | null) => void;
  onBackChange: (value: string | null) => void;
  documentType?: string;
}

type DocumentSide = "front" | "back";

const DOCUMENT_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's License",
  passport: "Passport",
  postal_id: "Postal ID",
  voters_id: "Voter's ID",
};

export function DocumentRecognition({
  frontValue,
  backValue,
  onFrontChange,
  onBackChange,
  documentType,
}: DocumentRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingSideRef = useRef<DocumentSide | null>(null);

  const [activeSide, setActiveSide] = useState<DocumentSide | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("documentUploader");

  const documentLabel = useMemo(() => {
    if (!documentType) {
      return "ID";
    }
    return DOCUMENT_LABELS[documentType] || "ID";
  }, [documentType]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    pendingSideRef.current = null;
    setActiveSide(null);
    setIsStartingCamera(false);
  }, []);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream || !pendingSideRef.current) {
      return;
    }

    const handleLoadedMetadata = () => {
      video.play().catch(() => undefined);
      setIsStartingCamera(false);
    };

    video.srcObject = stream;
    video.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [activeSide]);

  const startCapture = useCallback(async (side: DocumentSide) => {
    if (activeSide) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera access is not supported in this browser.");
      return;
    }

    try {
      setIsStartingCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      pendingSideRef.current = side;
      setActiveSide(side);
    } catch (error) {
      console.error("Document scanner camera error", error);
      toast.error("Unable to access camera. Please allow camera permissions.");
      setIsStartingCamera(false);
    }
  }, [activeSide]);

  const handleCapture = useCallback(async () => {
    if (!activeSide || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Unable to capture image. Please try again.");
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    setIsUploading(true);

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((result) => resolve(result), "image/jpeg", 0.95)
      );

      if (!blob) {
        throw new Error("Failed to capture frame");
      }

      const file = new File([blob], `document-${activeSide}-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const response = await startUpload([file]);
      const uploadedUrl = response?.[0]?.url;

      if (!uploadedUrl) {
        throw new Error("Upload failed");
      }

      if (activeSide === "front") {
        onFrontChange(uploadedUrl);
        toast.success("Front side captured");
      } else {
        onBackChange(uploadedUrl);
        toast.success("Back side captured");
      }
    } catch (error) {
      console.error("Document capture error", error);
      toast.error("Failed to capture document. Please try again.");
    } finally {
      setIsUploading(false);
      stopStream();
    }
  }, [activeSide, onBackChange, onFrontChange, startUpload, stopStream]);

  const handleCancel = useCallback(() => {
    stopStream();
  }, [stopStream]);

  const frontCaptured = Boolean(frontValue);
  const backCaptured = Boolean(backValue);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Front Side</span>
            <Badge variant={frontCaptured ? "default" : "outline"}>
              {frontCaptured ? "Captured" : "Pending"}
            </Badge>
          </div>
          {frontCaptured ? (
            <>
              <img
                src={frontValue}
                alt={`Front side of ${documentLabel}`}
                className="mt-3 aspect-3/2 w-full rounded-md border object-cover"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onFrontChange(null);
                    startCapture("front");
                  }}
                  disabled={activeSide !== null || isUploading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake front scan
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-muted-foreground">
                Capture the front side of your {documentLabel}. Make sure the details are readable.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => startCapture("front")}
                disabled={activeSide !== null || isStartingCamera || isUploading}
              >
                {isStartingCamera && pendingSideRef.current === "front" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting camera...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" /> Scan front side
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Back Side</span>
            <Badge variant={backCaptured ? "default" : "outline"}>
              {backCaptured ? "Captured" : "Pending"}
            </Badge>
          </div>
          {backCaptured ? (
            <>
              <img
                src={backValue}
                alt={`Back side of ${documentLabel}`}
                className="mt-3 aspect-3/2 w-full rounded-md border object-cover"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onBackChange(null);
                    startCapture("back");
                  }}
                  disabled={activeSide !== null || isUploading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake back scan
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-muted-foreground">
                After the front side, scan the back side to complete document recognition.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => startCapture("back")}
                disabled={!frontCaptured || activeSide !== null || isStartingCamera || isUploading}
              >
                {isStartingCamera && pendingSideRef.current === "back" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting camera...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" /> Scan back side
                  </>
                )}
              </Button>
              {!frontCaptured && (
                <p className="text-xs text-muted-foreground">
                  Capture the front side first to unlock the back side scan.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {activeSide && (
        <div className="relative overflow-hidden rounded-lg border bg-black/80">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="aspect-3/2 w-full object-contain"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white">
            <div className="text-center text-sm font-semibold uppercase tracking-wide">
              Align the {activeSide} side inside the guide
            </div>
            <div className="mx-auto mb-10 h-44 w-72 rounded-lg border-2 border-dashed border-white/80 bg-white/5" />
            <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={handleCapture}
                disabled={isUploading}
                className="shadow-lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>Capture {activeSide === "front" ? "front" : "back"} side</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
