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

  // Audio Refs
  const isAudioReady = useRef(false);
  const windOscillator = useRef<Tone.Oscillator | null>(null);
  const rainNoise = useRef<Tone.Noise | null>(null);
  const windVolume = useRef<Tone.Volume | null>(null);
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
      windVolume.current = new Tone.Volume(-20).toDestination();
      windOscillator.current = new Tone.Oscillator(200, "sine")
        .connect(windVolume.current)
        .start();
      rainVolume.current = new Tone.Volume(-Infinity).toDestination();
      rainNoise.current = new Tone.Noise("pink")
        .connect(rainVolume.current)
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
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data.length]);

  // Audio Sync Mapping
  useEffect(() => {
    if (isPlaying && data.length > 0 && isAudioReady.current) {
      const currentData = data[currentIndex];

      // Wind = Pitch (100Hz to ~800Hz)
      const windFreq = 100 + currentData.wind * 28;
      windOscillator.current?.frequency.rampTo(windFreq, 0.1);

      // Rain = Volume (-40dB to ~0dB)
      let rainVol = -40 + currentData.rain * 4;
      if (currentData.rain === 0) rainVol = -Infinity;
      rainVolume.current?.volume.rampTo(rainVol, 0.1);
    }
  }, [currentIndex, isPlaying, data]);

  // Mute Control
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

      {/* Grid ကို Chart ပေါ်နိုင်ရန် ဘယ်ဘက်ခြမ်းအတွက် 300px မှ 320px ထိ ချဲ့ပေးထားပါသည် */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_320px] xl:grid-cols-[340px_minmax(0,1fr)_400px] gap-6">
        {/* Left Column: Real-time Charts & Legend */}
        <DataCharts data={data} currentIndex={currentIndex} />

        {/* Center Column: Turntable */}
        <Turntable isPlaying={isPlaying} lat={lat} lon={lon} />

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
