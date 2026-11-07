"use client";
import React from "react";

export function Turntable({
  isPlaying,
  lat,
  lon,
}: {
  isPlaying: boolean;
  lat: string;
  lon: string;
}) {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 md:p-8 border border-gray-800 shadow-2xl flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-full">
      {/* အပြင်ဘက်ဆုံး အလင်းရောင် (Outer Glow) */}
      <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[480px] lg:h-[480px] xl:w-[550px] xl:h-[550px] rounded-full border border-cyan-900/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]"></div>

      {/* Turntable Base (ဓာတ်ပြားစက် အောက်ခံ) */}
      <div className="w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] rounded-full bg-[#111] border-[8px] sm:border-[12px] border-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex justify-center items-center relative z-10 transition-all">
        <div className="absolute inset-0 rounded-full border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.5)] mix-blend-screen"></div>

        {/* ========================================== */}
        {/* SPINNING VINYL RECORD */}
        {/* ========================================== */}
        <div
          className={`w-[88%] h-[88%] rounded-full flex justify-center items-center relative ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}
          style={{
            background:
              "repeating-radial-gradient(#111 0px, #1a1a1a 2px, #0a0a0a 4px)",
          }}
        >
          {/* Vinyl Track Separator Lines (လည်နေသည်ကို ပိုသိသာစေမည့် အစင်းကြောင်းများ) */}
          <div className="absolute inset-0 rounded-full border-[1px] border-white/5 m-[15%]"></div>
          <div className="absolute inset-0 rounded-full border-[1px] border-white/5 m-[28%]"></div>

          {/* CLASSIC CENTER LABEL (ကမ္ဘာလုံးအစား ဓာတ်ပြားတံဆိပ်ခေါင်း) */}
          <div className="w-[35%] h-[35%] rounded-full shadow-[0_0_25px_rgba(0,0,0,0.9)] z-20 flex flex-col justify-center items-center bg-gradient-to-br from-cyan-900 to-blue-950 border-4 border-[#222] relative overflow-hidden">
            <div className="absolute top-[10%] w-full text-center">
              <span className="text-[7px] sm:text-[9px] text-cyan-400 font-bold tracking-[0.2em] uppercase">
                APOLLO 3
              </span>
            </div>

            <div className="w-full text-center px-1 z-10 mb-3">
              <h4 className="text-[9px] sm:text-[11px] text-white font-black leading-tight tracking-wider">
                EARTH
                <br />
                JUKEBOX
              </h4>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#0a0a0a] rounded-full border-[2px] border-gray-700 shadow-inner z-30"></div>

            <div className="absolute bottom-[10%] w-full text-center">
              <span className="text-[6px] sm:text-[8px] text-blue-300 font-mono tracking-widest">
                APOLLO 3
              </span>
            </div>

            <div className="absolute inset-1 rounded-full border border-cyan-500/30"></div>
          </div>
        </div>

        <div
          className={`absolute top-[5%] right-[-5%] lg:right-[-8%] w-6 sm:w-8 xl:w-10 h-[45%] bg-gradient-to-b from-gray-300 to-gray-500 rounded-full origin-top transform transition-transform duration-700 shadow-2xl z-30 ${isPlaying ? "rotate-35" : "rotate-12"}`}
        >
          <div className="absolute bottom-[-10px] left-[-20%] sm:bottom-[-15px] sm:left-[-25%] w-[140%] h-[30%] bg-[#222] border-t border-gray-400 rounded-sm shadow-xl flex items-end p-1">
            <div className="w-[20%] h-[30%] bg-red-500 mx-auto rounded-sm"></div>
          </div>
        </div>

        {/* Data Label */}
        <div className="absolute bottom-[5%] left-[5%] bg-gray-800 px-2 py-1 border border-gray-600 rounded text-[9px] sm:text-[10px] font-mono text-gray-400 shadow-inner">
          NASA DATA : [{lat}, {lon}]
        </div>
      </div>
    </div>
  );
}
