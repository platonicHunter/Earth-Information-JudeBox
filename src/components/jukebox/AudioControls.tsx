"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  VolumeX,
  Volume2,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { WeatherData } from "@/services/nasaApi";

// Map.tsx ကို Client-side တွင်သာ Render လုပ်ရန် Dynamic Import သုံးခြင်း
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full text-cyan-500 text-xs">
      Loading Map...
    </div>
  ),
});

interface AudioControlsProps {
  data: WeatherData[];
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  lat: string; // ထပ်တိုးထားသော Props များ
  lon: string;
}

export function AudioControls({
  data,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  lat,
  lon,
}: AudioControlsProps) {
  return (
    <div className="bg-[#1a2332] rounded-xl p-5 md:p-6 border border-gray-800 shadow-xl flex flex-col justify-between gap-6 lg:h-full shrink-0 w-full">
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center shrink-0">
          <h3 className="text-gray-300 text-sm md:text-base font-medium">
            Visual Playback Sync
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">
            {data.length > 0 ? data[currentIndex]?.time : "NO DATA"}
          </span>
        </div>

        {/* Dynamic Interactive Map Section */}
        <div className="flex-1 w-full min-h-50 bg-black rounded-lg border border-gray-700 relative overflow-hidden shadow-inner">
          {/* Leaflet Map */}
          <DynamicMap
            lat={parseFloat(lat) || 20.14}
            lon={parseFloat(lon) || 92.9}
          />

          {/* Audio Sync Visual Effect Overlay */}
          {isPlaying && (
            <div
              className="absolute inset-0 bg-cyan-500/30 mix-blend-color transition-opacity duration-100 pointer-events-none z-400"
              style={{
                opacity:
                  data.length > 0 ? 0.2 + data[currentIndex]?.wind / 100 : 0,
              }}
            ></div>
          )}

          {/* Floating Data Display */}
          <div className="absolute bottom-2 left-2 text-[10px] sm:text-xs font-mono text-cyan-300 bg-black/80 px-2 py-1 rounded shadow border border-gray-800 z-400">
            Wind: {data[currentIndex]?.wind?.toFixed(1) || 0} m/s | Rain:{" "}
            {data[currentIndex]?.rain?.toFixed(1) || 0} mm
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex justify-between items-center px-2 sm:px-4 shrink-0 text-gray-400 my-2">
          <button className="hover:text-cyan-400 transition">
            <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button className="hover:text-cyan-400 transition">
            <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-600 flex justify-center items-center text-white hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all bg-[#0a0f18]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current" />
            )}
          </button>
          <button className="hover:text-cyan-400 transition">
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button className="hover:text-cyan-400 transition">
            <Repeat className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="shrink-0">
        <div className="mb-6 relative">
          <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-mono uppercase tracking-wider">
            <span>Start</span>
            <span className="text-cyan-500/50">Timeline Slide Control</span>
            <span>End</span>
          </div>
          <input
            type="range"
            min="0"
            max={data.length > 0 ? data.length - 1 : 100}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            disabled={data.length === 0}
            className="w-full h-1.5 md:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={toggleMute}
            className="flex-1 bg-[#222a38] border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 py-3 md:py-4 rounded-lg flex justify-center items-center text-sm md:text-base font-semibold transition"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 md:w-5 md:h-5 mr-2 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400" />
            )}
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={togglePlay}
            disabled={data.length === 0}
            className="flex-1 bg-linear-to-r from-cyan-900 to-cyan-800 border border-cyan-500 text-cyan-100 hover:brightness-125 py-3 md:py-4 rounded-lg flex justify-center items-center text-sm md:text-base font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)] transition disabled:opacity-50"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" /> PLAY
            AUDIO
          </button>
        </div>
      </div>
    </div>
  );
}
