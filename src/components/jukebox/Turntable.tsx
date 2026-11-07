"use client";
import React from "react";
import {
  Sun,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  Wind,
} from "lucide-react";

interface TurntableProps {
  isPlaying: boolean;
  lat: string;
  lon: string;
  wind?: number;
  rain?: number;
}

export function Turntable({
  isPlaying,
  lat,
  lon,
  wind = 0,
  rain = 0,
}: TurntableProps) {
  // ရာသီဥတု အခြေအနေကို အသေးစိတ် ခွဲခြားခြင်း
  const getWeatherState = () => {
    if (rain > 10 || (wind > 15 && rain > 5)) {
      return {
        type: "thunder",
        label: "⚡ Heavy Storm & Thunder",
        bg: "from-purple-950 via-slate-900 to-gray-950",
        glow: "shadow-[0_0_100px_rgba(168,85,247,0.3)]",
        text: "text-purple-400",
        icon: (
          <CloudLightning className="w-5 h-5 text-purple-400 animate-bounce" />
        ),
      };
    } else if (rain > 5) {
      return {
        type: "heavy-rain",
        label: "🌧️ Heavy Rain",
        bg: "from-blue-950 via-slate-900 to-gray-950",
        glow: "shadow-[0_0_100px_rgba(59,130,246,0.3)]",
        text: "text-blue-400",
        icon: <CloudRain className="w-5 h-5 text-blue-400 animate-pulse" />,
      };
    } else if (rain > 0) {
      return {
        type: "light-rain",
        label: "🌦️ Light / Moderate Rain",
        bg: "from-cyan-950 via-slate-900 to-gray-950",
        glow: "shadow-[0_0_100px_rgba(6,182,212,0.25)]",
        text: "text-cyan-400",
        icon: <CloudDrizzle className="w-5 h-5 text-cyan-400 animate-pulse" />,
      };
    } else if (wind > 8) {
      return {
        type: "windy",
        label: "💨 Windy Breeze",
        bg: "from-amber-950 via-slate-900 to-gray-950",
        glow: "shadow-[0_0_100px_rgba(245,158,11,0.25)]",
        text: "text-amber-400",
        icon: <Wind className="w-5 h-5 text-amber-400 animate-spin" />,
      };
    } else {
      return {
        type: "sunny",
        label: "☀️ Sunny & Clear",
        bg: "from-emerald-950 via-slate-900 to-gray-950",
        glow: "shadow-[0_0_100px_rgba(16,185,129,0.2)]",
        text: "text-emerald-400",
        icon: <Sun className="w-5 h-5 text-emerald-400 animate-spin" />,
      };
    }
  };

  const weather = getWeatherState();

  return (
    <div
      className={`rounded-xl p-4 md:p-8 border border-gray-800 shadow-2xl flex items-center justify-center relative overflow-hidden min-h-100 lg:min-h-full bg-linear-to-br ${weather.bg} transition-all duration-700`}
    >
      {/* CSS Animation Keyframes for Weather Effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes rainfall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        @keyframes flash {
          0%, 90%, 100% { opacity: 0; }
          92% { opacity: 0.4; }
          94% { opacity: 0.1; }
          96% { opacity: 0.6; }
        }
        .rain-drop {
          position: absolute;
          width: 2px;
          height: 15px;
          background: linear-gradient(transparent, rgba(255,255,255,0.6));
          animation: rainfall 0.8s linear infinite;
        }
        .thunder-flash {
          animation: flash 4s infinite;
        }
      `,
        }}
      />

      {/* 1. Thunder Flash Effect */}
      {weather.type === "thunder" && (
        <div className="absolute inset-0 bg-purple-500/20 thunder-flash pointer-events-none z-0"></div>
      )}

      {/* 2. Rain Animation Effect (မိုးစက်ကျသည့် ပုံစံများ) */}
      {(weather.type === "heavy-rain" ||
        weather.type === "light-rain" ||
        weather.type === "thunder") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
          <div
            className="rain-drop"
            style={{
              left: "15%",
              animationDelay: "0.1s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
          <div
            className="rain-drop"
            style={{
              left: "30%",
              animationDelay: "0.4s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
          <div
            className="rain-drop"
            style={{
              left: "45%",
              animationDelay: "0.2s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
          <div
            className="rain-drop"
            style={{
              left: "60%",
              animationDelay: "0.5s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
          <div
            className="rain-drop"
            style={{
              left: "75%",
              animationDelay: "0.3s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
          <div
            className="rain-drop"
            style={{
              left: "90%",
              animationDelay: "0.6s",
              height: weather.type === "heavy-rain" ? "25px" : "15px",
            }}
          ></div>
        </div>
      )}

      {/* Radiant Glow Background */}
      <div
        className={`absolute w-[320px] h-80 sm:w-105 sm:h-105 rounded-full ${weather.glow} pointer-events-none transition-all duration-700 animate-pulse z-0`}
      ></div>

      {/* Turntable Base */}
      <div className="w-65 h-65 sm:w-85 sm:h-85 lg:w-105 lg:h-105 rounded-full bg-[#111] border-8 border-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex justify-center items-center relative z-10">
        {/* Spinning Vinyl Record */}
        <div
          className={`w-[88%] h-[88%] rounded-full flex justify-center items-center relative ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}
          style={{
            background:
              "repeating-radial-gradient(#111 0px, #1a1a1a 2px, #0a0a0a 4px)",
          }}
        >
          {/* Vinyl Tracks Overlay */}
          <div className="absolute inset-0 rounded-full border border-white/5 m-[15%]"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 m-[28%]"></div>

          {/* Center Label */}
          <div className="w-[35%] h-[35%] rounded-full shadow-2xl z-20 flex flex-col justify-center items-center bg-linear-to-br from-cyan-900 to-blue-950 border-4 border-[#222] relative overflow-hidden">
            <span className="text-[7px] text-cyan-400 font-bold tracking-widest">
              NASA POWER
            </span>
            <h4 className="text-[9px] text-white font-black tracking-wider">
              EARTH
            </h4>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0a0a] rounded-full border border-gray-700"></div>
          </div>
        </div>

        {/* Tone Arm */}
        <div
          className={`absolute top-[5%] right-[-5%] lg:right-[-8%] w-6 sm:w-8 h-[45%] bg-linear-to-b from-gray-300 to-gray-500 rounded-full origin-top transform transition-transform duration-700 shadow-2xl z-30 ${isPlaying ? "rotate-35" : "rotate-12"}`}
        >
          <div className="absolute -bottom-2.5 left-[-20%] w-[140%] h-[30%] bg-[#222] border-t border-gray-400 rounded-sm shadow-xl flex items-end p-1">
            <div className="w-[20%] h-[30%] bg-red-500 mx-auto rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Live Status Badge with Weather Icons */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-gray-700 px-3 py-1.5 rounded-full text-[10px] font-mono text-gray-200 z-30 flex items-center gap-2 shadow-lg">
        {weather.icon}
        <span>
          Status: <strong className={weather.text}>{weather.label}</strong>
        </span>
      </div>

      {/* Data Label */}
      <div className="absolute bottom-[5%] left-[5%] bg-black/60 backdrop-blur px-2 py-1 border border-gray-700 rounded text-[9px] sm:text-[10px] font-mono text-cyan-300 shadow-inner z-30">
        NASA DATA : [{lat}, {lon}]
      </div>
    </div>
  );
}
