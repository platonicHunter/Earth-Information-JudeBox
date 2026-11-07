"use client";
import React from "react";

export function VintageDials() {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 flex flex-row lg:flex-col items-center justify-around lg:justify-center lg:gap-12 border border-gray-800 shadow-xl h-auto lg:h-full shrink-0">
      <div className="flex flex-col items-center gap-2 w-1/3 lg:w-full">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-gray-300 to-gray-500 border-[3px] border-gray-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative flex justify-center cursor-pointer hover:scale-105 transition">
          <div className="w-1 h-5 md:h-6 bg-gray-800 absolute top-0 origin-bottom transform rotate-12 rounded-t"></div>
        </div>
        <span className="text-[9px] text-gray-400 text-center uppercase tracking-wider hidden sm:block">
          Interactive
          <br />
          Dials
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 w-1/3 lg:w-full lg:border-t-2 lg:border-cyan-500 lg:pt-8">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg')] bg-cover bg-center border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"></div>
        <span className="text-[9px] text-gray-400 text-center uppercase tracking-wider hidden sm:block">
          Vinyl
          <br />
          Player
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 w-1/3 lg:w-full lg:mt-4">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative flex justify-center cursor-pointer hover:scale-105 transition">
          <div className="w-1 h-4 md:h-5 bg-red-500 absolute top-2 rounded"></div>
        </div>
        <span className="text-[9px] text-gray-400 text-center uppercase tracking-wider hidden sm:block">
          Vintage
          <br />
          Knobs
        </span>
      </div>
    </div>
  );
}
