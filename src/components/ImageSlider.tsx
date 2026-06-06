/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, MouseEvent, TouchEvent } from "react";

interface ImageSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeTitle?: string;
  afterTitle?: string;
}

export default function ImageSlider(props: ImageSliderProps) {
  const {
    beforeImg,
    afterImg,
    beforeTitle = "BEFORE TREATMENT",
    afterTitle = "AFTER REMEDIATION"
  } = props;

  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePos = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 || e.buttons === 0) { // Hover-active compare or drag
      calculatePos(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      calculatePos(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      id="slider-comparison-container"
      className="relative w-full h-[380px] md:h-[450px] overflow-hidden select-none rounded-2xl shadow-xl border border-slate-700 bg-slate-900 group"
    >
      {/* After Image (Background) */}
      <img
        src={afterImg}
        alt="After remediation"
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      
      {/* Target After Text Badge */}
      <div className="absolute right-4 top-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-mono tracking-widest text-[#60a5fa] uppercase font-bold select-none pointer-events-none z-10 transition-opacity duration-300">
        {afterTitle}
      </div>

      {/* Before Image (Overlay clipped by clipPath polygon based on slider state) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
        }}
      >
        <img
          src={beforeImg}
          alt="Before remediation"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Target Before Text Badge */}
        <div className="absolute left-4 top-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-mono tracking-widest text-[#f87171] uppercase font-bold select-none pointer-events-none z-10">
          {beforeTitle}
        </div>
      </div>

      {/* Slide Interactive Over-zone */}
      <div
        id="slider-sensor-trigger"
        className="absolute inset-0 w-full h-full cursor-ew-resize z-20"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => calculatePos(e.clientX)}
      />

      {/* Quick Toggle Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800/80 z-30">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSliderPos(100);
          }}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer ${
            sliderPos === 100 
              ? "bg-rose-950/50 text-rose-400 border border-rose-500/35" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Before
        </button>
        <div className="w-[1px] h-3 bg-slate-850" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSliderPos(50);
          }}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer ${
            sliderPos === 50 
              ? "bg-blue-950/60 text-blue-400 border border-blue-500/40" 
              : "text-slate-350 hover:text-white"
          }`}
        >
          Compare
        </button>
        <div className="w-[1px] h-3 bg-slate-850" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSliderPos(0);
          }}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer ${
            sliderPos === 0 
              ? "bg-blue-950/60 text-blue-400 border border-blue-500/40" 
              : "text-slate-350 hover:text-white"
          }`}
        >
          After
        </button>
      </div>

      {/* Vertical Slider Bar Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-blue-600 cursor-ew-resize flex items-center justify-center pointer-events-none z-10 group-hover:bg-blue-500 drop-shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-9 h-9 bg-slate-900 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-xl font-bold text-sm pointer-events-none transition-transform duration-200 group-hover:scale-110">
          <svg
            className="w-5 h-5 text-blue-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 9l-4 4 4 4m8 0l4-4-4-4"
            />
          </svg>
        </div>
      </div>
      
      {/* Help hint banner at the bottom */}
      <div className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-sm shadow-md px-3 py-1.5 rounded-lg text-[9px] font-mono font-semibold text-slate-400 pointer-events-none tracking-wider z-10 uppercase transition-all duration-300 opacity-60 group-hover:opacity-100">
        ◀ Slide to compare ▶
      </div>
    </div>
  );
}
