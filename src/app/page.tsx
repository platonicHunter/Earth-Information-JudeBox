"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { Header } from "@/components/layout/Header";
import { DataCharts } from "@/components/charts/DataCharts";
import { Turntable } from "@/components/jukebox/Turntable";
import { AudioControls } from "@/components/jukebox/AudioControls";
import { fetchNasaWeather, WeatherData } from "@/services/nasaApi";

export default function Dashboard() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Header States
  const [locationQuery, setLocationQuery] = useState("");
  const [lat, setLat] = useState("20.14");
  const [lon, setLon] = useState("92.90");
  const [startDate, setStartDate] = useState("2023-05-10");
  const [endDate, setEndDate] = useState("2023-05-16");

  // ==========================================
  // PURE SYNTHESIS AUDIO REFS (Tone.js)
  // ==========================================
  const isAudioReady = useRef(false);

  // Wind Audio Nodes
  const windNoise = useRef<Tone.Noise | null>(null);
  const windFilter = useRef<Tone.Filter | null>(null);
  const windVolume = useRef<Tone.Volume | null>(null);

  // Rain Audio Nodes
  const rainNoise = useRef<Tone.Noise | null>(null);
  const rainFilter = useRef<Tone.Filter | null>(null);
  const rainVolume = useRef<Tone.Volume | null>(null);

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const weatherData = await fetchNasaWeather(lat, lon, startDate, endDate);
      setData(weatherData);
      setCurrentIndex(0);
      if (isPlaying) handleTogglePlay();
    } catch (error) {
      alert("Failed to fetch NASA data.");
    }
    setLoading(false);
  };

  const setupAudio = async () => {
    if (!isAudioReady.current) {
      await Tone.start();

      // 1. Wind Generator
      windVolume.current = new Tone.Volume(-Infinity).toDestination();
      windFilter.current = new Tone.Filter(300, "lowpass").connect(
        windVolume.current,
      );
      windNoise.current = new Tone.Noise("brown")
        .connect(windFilter.current)
        .start();

      // 2. Rain Generator
      rainVolume.current = new Tone.Volume(-Infinity).toDestination();
      rainFilter.current = new Tone.Filter(800, "highpass").connect(
        rainVolume.current,
      );
      rainNoise.current = new Tone.Noise("pink")
        .connect(rainFilter.current)
        .start();

      isAudioReady.current = true;
    }
  };

  const handleTogglePlay = async () => {
    if (data.length === 0) return alert("Please load NASA data first.");

    if (!isPlaying) {
      await setupAudio();
      if (windVolume.current) windVolume.current.mute = isMuted;
      if (rainVolume.current) rainVolume.current.mute = isMuted;
    } else {
      if (windVolume.current) windVolume.current.mute = true;
      if (rainVolume.current) rainVolume.current.mute = true;
    }
    setIsPlaying(!isPlaying);
  };

  // Timeline Auto-Play
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && data.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= data.length - 1 ? 0 : prev + 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data.length]);

  // ==========================================
  // REAL-TIME DATA SONIFICATION MAPPING
  // ==========================================
  useEffect(() => {
    if (isPlaying && data.length > 0 && isAudioReady.current) {
      const currentData = data[currentIndex];
      const w = currentData.wind;
      const r = currentData.rain;

      // --- Wind Mapping ---
      if (windVolume.current && windFilter.current) {
        if (w > 0) {
          windVolume.current.volume.rampTo(-35 + w * 1.5, 0.3);
          windFilter.current.frequency.rampTo(200 + w * 40, 0.3);
        } else {
          windVolume.current.volume.rampTo(-Infinity, 0.5);
        }
      }

      // --- Rain Mapping ---
      if (rainVolume.current && rainFilter.current) {
        if (r > 0) {
          rainVolume.current.volume.rampTo(-30 + r * 2, 0.3);
        } else {
          rainVolume.current.volume.rampTo(-Infinity, 0.5);
        }
      }
    }
  }, [currentIndex, isPlaying, data]);

  // Master Mute Control
  useEffect(() => {
    if (windVolume.current) windVolume.current.mute = isMuted || !isPlaying;
    if (rainVolume.current) rainVolume.current.mute = isMuted || !isPlaying;
  }, [isMuted, isPlaying]);

  return (
    <div className="min-h-screen w-full bg-[#0a0f18] text-gray-200 p-4 md:p-6 lg:p-8 flex flex-col select-none font-sans overflow-x-hidden">
      <Header
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        lat={lat}
        setLat={setLat}
        lon={lon}
        setLon={setLon}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onLoadData={handleLoadData}
        loading={loading}
      />

      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_320px] xl:grid-cols-[340px_minmax(0,1fr)_400px] gap-6">
        {/* Left Column: Real-time Charts & Legend */}
        <DataCharts data={data} currentIndex={currentIndex} />

        {/* Center Column: Turntable with Live Weather Visuals */}
        <Turntable
          isPlaying={isPlaying}
          lat={lat}
          lon={lon}
          wind={data[currentIndex]?.wind || 0}
          rain={data[currentIndex]?.rain || 0}
          currentTime={data[currentIndex]?.time || "N/A"}
        />

        {/* Right Column: Audio Controls & Visual Map */}
        <AudioControls
          data={data}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isPlaying={isPlaying}
          togglePlay={handleTogglePlay}
          isMuted={isMuted}
          toggleMute={() => setIsMuted(!isMuted)}
          lat={lat}
          lon={lon}
        />
      </div>
    </div>
  );
}
