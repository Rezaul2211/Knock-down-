import React, { useState } from 'react';
import { handleImageError } from '../lib/imageUtils';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

export function ImageMagnifier({
  src,
  alt,
  magnifierHeight = 250,
  magnifierWidth = 250,
  zoomLevel = 2.5
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  return (
    <div
      className="relative w-full h-full cursor-zoom-in"
      onMouseEnter={(e) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
      }}
      onMouseMove={(e) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;
        setXY([mouseX, mouseY]);
      }}
      onMouseLeave={() => {
        setShowMagnifier(false);
      }}
      onTouchStart={(e) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
      }}
      onTouchMove={(e) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();
        const touch = e.touches[0];
        const mouseX = touch.clientX - left;
        const mouseY = touch.clientY - top;
        setXY([mouseX, mouseY]);
      }}
      onTouchEnd={() => {
        setShowMagnifier(false);
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
        onError={handleImageError}
      />

      <div
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",
          pointerEvents: "none",
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          opacity: "1",
          border: "1px solid #e5e7eb",
          backgroundColor: "white",
          backgroundImage: `url('${src}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
          borderRadius: "50%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 0 5px rgba(255,255,255,0.9)",
          zIndex: 40
        }}
      />
    </div>
  );
}
