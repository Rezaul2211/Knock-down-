import React, { useRef, useEffect, useState } from 'react';
import { FabricSwatch } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sun, Moon, Sparkles, Layers, Sliders } from 'lucide-react';

export type GarmentType = 'panjabi' | 'suit' | 'gown' | 'waistcoat' | 'kameez' | 'frock';

interface FabricVisualizerCanvasProps {
  fabric: FabricSwatch;
  compareFabric?: FabricSwatch | null;
  garmentType: GarmentType;
  onGarmentTypeChange?: (type: GarmentType) => void;
  scale?: number;
  rotation?: number;
  lightingMode?: 'daylight' | 'evening' | 'studio';
  viewAngle?: 'front' | 'back' | 'closeup';
  className?: string;
  isInteractive?: boolean;
}

export function FabricVisualizerCanvas({
  fabric,
  compareFabric,
  garmentType,
  onGarmentTypeChange,
  scale = 1.0,
  rotation = 0,
  lightingMode = 'studio',
  viewAngle = 'front',
  className = '',
  isInteractive = true
}: FabricVisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compareCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentScale, setCurrentScale] = useState(scale);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [currentLighting, setCurrentLighting] = useState(lightingMode);
  const [currentAngle, setCurrentAngle] = useState(viewAngle);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFolds, setShowFolds] = useState(true);

  useEffect(() => {
    setCurrentScale(scale);
  }, [scale]);

  useEffect(() => {
    setCurrentRotation(rotation);
  }, [rotation]);

  useEffect(() => {
    setCurrentLighting(lightingMode);
  }, [lightingMode]);

  useEffect(() => {
    setCurrentAngle(viewAngle);
  }, [viewAngle]);

  // Main rendering logic
  useEffect(() => {
    renderGarment(canvasRef.current, fabric, currentScale, currentRotation, currentLighting, currentAngle, showFolds, zoomLevel, garmentType);
    if (compareFabric && compareCanvasRef.current) {
      renderGarment(compareCanvasRef.current, compareFabric, currentScale, currentRotation, currentLighting, currentAngle, showFolds, zoomLevel, garmentType);
    }
  }, [fabric, compareFabric, garmentType, currentScale, currentRotation, currentLighting, currentAngle, showFolds, zoomLevel]);

  return (
    <div className={`relative flex flex-col items-center w-full ${className}`}>
      {/* Visualizer Canvas Display Area */}
      <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b ${
        currentLighting === 'daylight' 
          ? 'from-[#F8FAFCE6] via-[#F1F5F9] to-[#E2E8F0]'
          : currentLighting === 'evening'
          ? 'from-[#2D1B2E] via-[#1F1625] to-[#120D17]'
          : 'from-[#18181B] via-[#27272A] to-[#09090B]'
      } border border-slate-700/30 shadow-xl flex items-center justify-center p-4 transition-colors duration-500`}>
        
        {/* Comparison split mode if compareFabric exists */}
        <div className={`w-full flex ${compareFabric ? 'flex-col md:flex-row gap-4' : 'justify-center'} items-center`}>
          
          {/* Main Fabric Visualizer */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] min-h-[380px] sm:min-h-[440px]">
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            
            {/* Fabric Tag overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg z-10 text-xs font-sans">
              <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: fabric.primaryColor }} />
              <div className="flex flex-col">
                <span className="font-bold truncate max-w-[150px]">{fabric.nameEn}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider">{fabric.code} &bull; {fabric.weavePattern}</span>
              </div>
            </div>
          </div>

          {/* Comparison Fabric Visualizer (if active) */}
          {compareFabric && (
            <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] min-h-[380px] sm:min-h-[440px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
              <canvas
                ref={compareCanvasRef}
                width={600}
                height={800}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              
              <div className="absolute bottom-3 left-3 bg-amber-950/85 backdrop-blur-md text-amber-100 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-2 shadow-lg z-10 text-xs font-sans">
                <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: compareFabric.primaryColor }} />
                <div className="flex flex-col">
                  <span className="font-bold truncate max-w-[150px]">{compareFabric.nameEn}</span>
                  <span className="text-[10px] text-amber-300/80 uppercase tracking-wider">{compareFabric.code}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Quick Action Controls Bar */}
        {isInteractive && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            {/* Lighting Mode Selector */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl p-1 flex flex-col gap-1 text-white shadow-lg">
              <button
                onClick={() => setCurrentLighting('daylight')}
                title="Daylight Lighting"
                className={`p-2 rounded-lg transition-all ${currentLighting === 'daylight' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-white/10 text-slate-300'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentLighting('studio')}
                title="Studio Gala Lighting"
                className={`p-2 rounded-lg transition-all ${currentLighting === 'studio' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-white/10 text-slate-300'}`}
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentLighting('evening')}
                title="Warm Evening Sunset"
                className={`p-2 rounded-lg transition-all ${currentLighting === 'evening' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-white/10 text-slate-300'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl p-1 flex flex-col gap-1 text-white shadow-lg">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                title="Zoom In"
                className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1.0))}
                title="Zoom Out"
                className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Adjustment Controls Toolbar */}
      {isInteractive && (
        <div className="w-full mt-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4 text-xs font-sans">
          
          {/* Row 1: Garment Type Selector */}
          {onGarmentTypeChange && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Select Garment Silhouette:</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'panjabi', label: 'Panjabi' },
                  { id: 'suit', label: 'Formal Suit' },
                  { id: 'waistcoat', label: 'Waistcoat' },
                  { id: 'kameez', label: 'Kameez' },
                  { id: 'gown', label: 'Gown' },
                  { id: 'frock', label: 'Frock' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => onGarmentTypeChange(item.id as GarmentType)}
                    className={`py-2 px-2 rounded-xl font-bold transition-all text-center border ${
                      garmentType === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Texture Tweaks (Scale, Rotation, View Angle, Folds) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            {/* Pattern Scale Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>Pattern Scale:</span>
                <span className="text-amber-700 font-bold">{currentScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={currentScale}
                onChange={e => setCurrentScale(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Pattern Rotation Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-slate-500" />
                  Weave Angle:
                </span>
                <span className="text-amber-700 font-bold">{currentRotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="15"
                value={currentRotation}
                onChange={e => setCurrentRotation(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* View Angle Toggle */}
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-500" />
                <span>Angle View:</span>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {[
                  { id: 'front', label: 'Front' },
                  { id: 'back', label: 'Back' },
                  { id: 'closeup', label: 'Collar/Detail' }
                ].map(angle => (
                  <button
                    key={angle.id}
                    onClick={() => setCurrentAngle(angle.id as any)}
                    className={`flex-1 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                      currentAngle === angle.id
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {angle.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Canvas rendering algorithm
function renderGarment(
  canvas: HTMLCanvasElement | null,
  fabric: FabricSwatch,
  scale: number,
  rotation: number,
  lighting: 'daylight' | 'evening' | 'studio',
  angle: 'front' | 'back' | 'closeup',
  showFolds: boolean,
  zoom: number,
  garmentType: GarmentType
) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Load texture image or create generative pattern
  const textureImg = new Image();
  textureImg.crossOrigin = 'anonymous';
  textureImg.src = fabric.textureImage || fabric.highResImage;

  const drawPattern = () => {
    ctx.save();

    // Create Path for requested garment
    ctx.beginPath();
    defineGarmentPath(ctx, width, height, garmentType, angle);
    ctx.clip(); // Clip pattern strictly within garment bounds

    // 1. Draw base fabric primary color
    ctx.fillStyle = fabric.primaryColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Render texture image pattern or procedural weave pattern
    if (textureImg.complete && textureImg.naturalWidth > 0) {
      try {
        const patternCanvas = document.createElement('canvas');
        const pCtx = patternCanvas.getContext('2d');
        const baseSize = 120 * scale;
        patternCanvas.width = baseSize;
        patternCanvas.height = baseSize;

        if (pCtx) {
          pCtx.save();
          pCtx.translate(baseSize / 2, baseSize / 2);
          pCtx.rotate((rotation * Math.PI) / 180);
          pCtx.drawImage(textureImg, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
          pCtx.restore();

          const pattern = ctx.createPattern(patternCanvas, 'repeat');
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.globalAlpha = fabric.category === 'silk' ? 0.75 : 0.88;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
          }
        }
      } catch (err) {
        // Fallback procedural pattern if cross-origin image fails
        drawProceduralWeave(ctx, width, height, fabric, scale, rotation);
      }
    } else {
      drawProceduralWeave(ctx, width, height, fabric, scale, rotation);
    }

    // 3. Lighting & Sheen Gradients (Daylight, Studio, Evening)
    applyLightingOverlay(ctx, width, height, lighting, fabric.sheen);

    // 4. Fabric Folds, Creases, and Depth Shadow Overlay
    if (showFolds) {
      applyClothFoldsAndShading(ctx, width, height, garmentType, angle);
    }

    ctx.restore(); // Restore clip

    // 5. Garment Outlines, Buttons, Stitching, Lapel & Collar details (Drawn over texture)
    drawGarmentDetails(ctx, width, height, garmentType, angle, fabric);
  };

  textureImg.onload = drawPattern;
  textureImg.onerror = drawPattern;

  if (textureImg.complete) {
    drawPattern();
  }
}

// Procedural fallback pattern renderer
function drawProceduralWeave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fabric: FabricSwatch,
  scale: number,
  rotation: number
) {
  ctx.save();
  ctx.fillStyle = fabric.primaryColor;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = fabric.secondaryColor || '#000000';
  ctx.lineWidth = 1 * scale;

  const step = 8 * scale;
  ctx.beginPath();

  if (fabric.patternType === 'striped') {
    for (let x = -width; x < width * 2; x += step * 2) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + Math.tan((rotation * Math.PI) / 180) * height, height);
    }
  } else if (fabric.patternType === 'checkered') {
    for (let x = 0; x < width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
  } else if (fabric.patternType === 'herringbone') {
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step * 2) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step / 2);
        ctx.lineTo(x + step * 2, y);
      }
    }
  } else {
    // Fine weave twill texture
    for (let i = -height; i < width + height; i += step) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
    }
  }

  ctx.stroke();
  ctx.restore();
}

// Garment Path outlines for clipping
function defineGarmentPath(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  garment: GarmentType,
  angle: 'front' | 'back' | 'closeup'
) {
  if (angle === 'closeup') {
    // Collar/Lapel Close-up view
    ctx.moveTo(w * 0.15, h * 0.05);
    ctx.lineTo(w * 0.85, h * 0.05);
    ctx.lineTo(w * 0.95, h * 0.95);
    ctx.lineTo(w * 0.05, h * 0.95);
    ctx.closePath();
    return;
  }

  const cx = w / 2;

  switch (garment) {
    case 'panjabi': {
      // Elegant Men's Panjabi (Straight cut, side slits, mandarin collar)
      ctx.moveTo(cx - w * 0.15, h * 0.12); // Left neck
      ctx.lineTo(cx - w * 0.38, h * 0.22); // Left shoulder
      ctx.lineTo(cx - w * 0.42, h * 0.55); // Left sleeve end
      ctx.lineTo(cx - w * 0.32, h * 0.55); // Underarm
      ctx.lineTo(cx - w * 0.28, h * 0.88); // Left bottom hem
      ctx.lineTo(cx + w * 0.28, h * 0.88); // Right bottom hem
      ctx.lineTo(cx + w * 0.32, h * 0.55); // Underarm
      ctx.lineTo(cx + w * 0.42, h * 0.55); // Right sleeve end
      ctx.lineTo(cx + w * 0.38, h * 0.22); // Right shoulder
      ctx.lineTo(cx + w * 0.15, h * 0.12); // Right neck
      ctx.quadraticCurveTo(cx, h * 0.18, cx - w * 0.15, h * 0.12); // Collar curve
      ctx.closePath();
      break;
    }
    case 'suit': {
      // Formal Suit Jacket (Structured shoulders, tapered waist, lapels)
      ctx.moveTo(cx - w * 0.16, h * 0.14);
      ctx.lineTo(cx - w * 0.4, h * 0.2);
      ctx.lineTo(cx - w * 0.44, h * 0.52);
      ctx.lineTo(cx - w * 0.33, h * 0.52);
      ctx.lineTo(cx - w * 0.28, h * 0.85);
      ctx.lineTo(cx + w * 0.28, h * 0.85);
      ctx.lineTo(cx + w * 0.33, h * 0.52);
      ctx.lineTo(cx + w * 0.44, h * 0.52);
      ctx.lineTo(cx + w * 0.4, h * 0.2);
      ctx.lineTo(cx + w * 0.16, h * 0.14);
      ctx.quadraticCurveTo(cx, h * 0.22, cx - w * 0.16, h * 0.14);
      ctx.closePath();
      break;
    }
    case 'waistcoat': {
      // Tailored Waistcoat
      ctx.moveTo(cx - w * 0.12, h * 0.15);
      ctx.lineTo(cx - w * 0.32, h * 0.22);
      ctx.lineTo(cx - w * 0.28, h * 0.48);
      ctx.lineTo(cx - w * 0.25, h * 0.82);
      ctx.lineTo(cx, h * 0.88); // V-bottom peak
      ctx.lineTo(cx + w * 0.25, h * 0.82);
      ctx.lineTo(cx + w * 0.28, h * 0.48);
      ctx.lineTo(cx + w * 0.32, h * 0.22);
      ctx.lineTo(cx + w * 0.12, h * 0.15);
      ctx.lineTo(cx, h * 0.45); // Deep V-neck cutout
      ctx.closePath();
      break;
    }
    case 'kameez': {
      // Salwar Kameez
      ctx.moveTo(cx - w * 0.14, h * 0.12);
      ctx.lineTo(cx - w * 0.36, h * 0.22);
      ctx.lineTo(cx - w * 0.38, h * 0.58);
      ctx.lineTo(cx - w * 0.26, h * 0.58);
      ctx.lineTo(cx - w * 0.3, h * 0.92);
      ctx.lineTo(cx + w * 0.3, h * 0.92);
      ctx.lineTo(cx + w * 0.26, h * 0.58);
      ctx.lineTo(cx + w * 0.38, h * 0.58);
      ctx.lineTo(cx + w * 0.36, h * 0.22);
      ctx.lineTo(cx + w * 0.14, h * 0.12);
      ctx.quadraticCurveTo(cx, h * 0.2, cx - w * 0.14, h * 0.12);
      ctx.closePath();
      break;
    }
    case 'gown': {
      // Flared Designer Evening Gown
      ctx.moveTo(cx - w * 0.12, h * 0.12);
      ctx.lineTo(cx - w * 0.28, h * 0.22);
      ctx.lineTo(cx - w * 0.18, h * 0.42); // Fitted waist
      ctx.lineTo(cx - w * 0.42, h * 0.92); // Wide flared skirt
      ctx.quadraticCurveTo(cx, h * 0.96, cx + w * 0.42, h * 0.92);
      ctx.lineTo(cx + w * 0.18, h * 0.42);
      ctx.lineTo(cx + w * 0.28, h * 0.22);
      ctx.lineTo(cx + w * 0.12, h * 0.12);
      ctx.quadraticCurveTo(cx, h * 0.2, cx - w * 0.12, h * 0.12);
      ctx.closePath();
      break;
    }
    case 'frock': {
      // Flared Kids Frock
      ctx.moveTo(cx - w * 0.12, h * 0.15);
      ctx.lineTo(cx - w * 0.26, h * 0.24);
      ctx.lineTo(cx - w * 0.16, h * 0.4);
      ctx.lineTo(cx - w * 0.38, h * 0.85);
      ctx.quadraticCurveTo(cx, h * 0.88, cx + w * 0.38, h * 0.85);
      ctx.lineTo(cx + w * 0.16, h * 0.4);
      ctx.lineTo(cx + w * 0.26, h * 0.24);
      ctx.lineTo(cx + w * 0.12, h * 0.15);
      ctx.quadraticCurveTo(cx, h * 0.22, cx - w * 0.12, h * 0.15);
      ctx.closePath();
      break;
    }
  }
}

// Lighting & Sheen gradient
function applyLightingOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lighting: 'daylight' | 'evening' | 'studio',
  sheen: string
) {
  ctx.save();
  const cx = w / 2;

  // Studio highlight gradient
  const lightGrad = ctx.createRadialGradient(
    cx - w * 0.1,
    h * 0.25,
    w * 0.05,
    cx,
    h * 0.5,
    w * 0.7
  );

  if (lighting === 'daylight') {
    lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  } else if (lighting === 'evening') {
    lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
    lightGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.12)');
    lightGrad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');
  } else {
    lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    lightGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  }

  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, w, h);

  // Extra sheen highlight for satin/silk
  if (sheen === 'high-gloss' || sheen === 'satin-shine') {
    const sheenGrad = ctx.createLinearGradient(0, 0, w, h);
    sheenGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)');
    sheenGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

// Fabric folds and depth shadows
function applyClothFoldsAndShading(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  garment: GarmentType,
  angle: string
) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.lineWidth = 4;

  const cx = w / 2;

  // Render vertical drape folds
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.1, h * 0.3);
  ctx.quadraticCurveTo(cx - w * 0.12, h * 0.6, cx - w * 0.15, h * 0.88);

  ctx.moveTo(cx + w * 0.1, h * 0.3);
  ctx.quadraticCurveTo(cx + w * 0.12, h * 0.6, cx + w * 0.15, h * 0.88);

  ctx.moveTo(cx, h * 0.35);
  ctx.quadraticCurveTo(cx, h * 0.6, cx, h * 0.88);
  ctx.stroke();

  // Side armpit fold creases
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 3;
  ctx.moveTo(cx - w * 0.32, h * 0.55);
  ctx.quadraticCurveTo(cx - w * 0.25, h * 0.52, cx - w * 0.2, h * 0.48);

  ctx.moveTo(cx + w * 0.32, h * 0.55);
  ctx.quadraticCurveTo(cx + w * 0.25, h * 0.52, cx + w * 0.2, h * 0.48);
  ctx.stroke();

  ctx.restore();
}

// Garment Details (Buttons, lapels, placket, stitching)
function drawGarmentDetails(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  garment: GarmentType,
  angle: string,
  fabric: FabricSwatch
) {
  ctx.save();
  const cx = w / 2;

  // Outline edge border
  ctx.beginPath();
  defineGarmentPath(ctx, w, h, garment, angle as any);
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw garment specific details
  if (garment === 'panjabi') {
    // Mandarin Collar & Placket
    ctx.fillStyle = '#B8860B'; // Gold accent placket
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 2;

    // Placket strip
    ctx.fillRect(cx - 12, h * 0.14, 24, h * 0.28);
    ctx.strokeRect(cx - 12, h * 0.14, 24, h * 0.28);

    // Golden Buttons
    for (let i = 0; i < 4; i++) {
      const by = h * 0.18 + i * 28;
      ctx.beginPath();
      ctx.arc(cx, by, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.stroke();
    }
  } else if (garment === 'suit') {
    // Lapels & Tie
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.16, h * 0.14);
    ctx.lineTo(cx - w * 0.08, h * 0.32);
    ctx.lineTo(cx, h * 0.48); // V-Button point
    ctx.lineTo(cx + w * 0.08, h * 0.32);
    ctx.lineTo(cx + w * 0.16, h * 0.14);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pocket square
    ctx.fillStyle = '#E8A5B8';
    ctx.beginPath();
    ctx.fillRect(cx + w * 0.12, h * 0.38, 22, 10);
  } else if (garment === 'waistcoat') {
    // Front buttons
    for (let i = 0; i < 5; i++) {
      const by = h * 0.48 + i * 26;
      ctx.beginPath();
      ctx.arc(cx, by, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
  }

  ctx.restore();
}
