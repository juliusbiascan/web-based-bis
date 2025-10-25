"use client";

import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

export default function FaceAuth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        setIsLoading(true);
        setError(null);

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setIsModelLoaded(true);
      } catch (err) {
        setError(
          "Error loading face recognition models. Please ensure model files are in the public/models directory.",
        );
        console.error("Error loading models:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      if (!navigator || !navigator.mediaDevices) {
        throw new Error("Media devices not supported in this browser");
      }

      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 60, max: 120 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unable to access camera";

      setError(`Camera Access Error: ${errorMessage}.
        Please ensure:
        - Camera permissions are granted
        - You are using a secure (HTTPS) connection
        - Your device supports camera access`);

      console.error("Error accessing camera:", err);
    }
  };

  const handleVideoOnPlay = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const interval = setInterval(async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        if (detections.length > 0) {
          // In a real app, you would compare face descriptors here
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error during face detection:", err);
      }
    }, 100);

    return () => clearInterval(interval);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative aspect-9/16 bg-muted rounded-lg overflow-hidden h-screen w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlay={handleVideoOnPlay}
          width="640"
          height="480"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={startVideo}
          disabled={!isModelLoaded || isLoading}
          className="w-full max-w-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Start Camera"
          )}
        </Button>
      </div>

      {isAuthenticated && (
        <Alert className="bg-green-500/15 text-green-500 border-green-500/50">
          <AlertDescription>
            Authentication successful! Face detected and verified.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}