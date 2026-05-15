"use client";
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

interface ImageSequenceProps {
  frameCount: number;
  imagePathPrefix: string;
  imageExtension?: string;
  padding?: number;
  onLoadComplete?: () => void;
}

export interface ImageSequenceHandle {
  setFrame: (progress: number) => void;
}

export const ImageSequence = forwardRef<ImageSequenceHandle, ImageSequenceProps>(({ 
  frameCount, 
  imagePathPrefix, 
  imageExtension = ".webp",
  padding = 3,
  onLoadComplete
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Expose setFrame to parent
  useImperativeHandle(ref, () => ({
    setFrame: (progress: number) => {
      render(progress);
    }
  }));

  const render = (prog: number) => {
    if (!imagesRef.current.length || !isLoaded) return;
    
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(prog * (frameCount - 1))));
      const img = imagesRef.current[frameIndex];
      if (!img || !img.complete) return;

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // MASK VEO WATERMARK
      context.fillStyle = "black";
      const maskW = canvas.width * 0.15;
      const maskH = canvas.height * 0.1;
      context.fillRect(canvas.width - maskW, canvas.height - maskH, maskW, maskH);
    });
  };



  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    const R2_URL = "https://pub-2773ce4c8a7943ae910bea9bf075b720.r2.dev";

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // CRITICAL for Canvas + R2
      const paddedIndex = (i + 1).toString().padStart(padding, "0");
      // Use R2 URL for sequences
      const fullPath = imagePathPrefix.startsWith("/") ? `${R2_URL}${imagePathPrefix}` : imagePathPrefix;
      img.src = `${fullPath}${paddedIndex}${imageExtension}`;
      img.onload = () => {
        count++;
        if (count === frameCount && !isLoaded) {
          setIsLoaded(true);
          onLoadComplete?.();
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [frameCount, imagePathPrefix, imageExtension, padding]);

  // Initial render when loaded
  useEffect(() => {
    if (isLoaded) render(0);
  }, [isLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set a high-quality internal resolution that preserves 16:9 or similar common cinema ratios
      // CSS object-cover will handle the screen fitting without distortion
      canvas.width = 1920;
      canvas.height = 1080;
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
       <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover pointer-events-none scale-100"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
           <div className="cinzel text-yellow-500/40 text-xs tracking-widest animate-pulse">
              SYNCING ASSETS...
           </div>
        </div>
      )}
    </div>
  );
});

ImageSequence.displayName = "ImageSequence";
