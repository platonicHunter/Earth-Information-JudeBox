"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Database, Loader2 } from "lucide-react";
import { geocodeLocation, LocationResult } from "@/services/nasaApi";

interface HeaderProps {
  locationQuery: string;
  setLocationQuery: (v: string) => void;
  lat: string;
  setLat: (v: string) => void;
  lon: string;
  setLon: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  onLoadData: () => void;
  loading: boolean;
}

export function Header({
  locationQuery,
  setLocationQuery,
  lat,
  setLat,
  lon,
  setLon,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onLoadData,
  loading,
}: HeaderProps) {
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto Search Logic (Debounce Technique)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationQuery.length > 2) {
        setIsSearching(true);
        const results = await geocodeLocation(locationQuery);
        setSearchResults(results);
        setShowDropdown(true);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 600); // User စာရိုက်ရပ်ပြီး ၀.၆ စက္ကန့်အကြာတွင် API ခေါ်မည်

    return () => clearTimeout(delayDebounceFn);
  }, [locationQuery]);

  // နေရာတစ်ခုကို ရွေးချယ်လိုက်သည့်အခါ
  const handleSelectLocation = (loc: LocationResult) => {
    setLat(loc.lat);
    setLon(loc.lon);
    setLocationQuery(loc.display_name.split(",")[0]); // မြို့နာမည်ကိုသာ Input တွင် ပြန်ပြမည်
    setShowDropdown(false);
  };

  return (
    <header className="w-full mb-8 flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-gray-800 pb-6 shrink-0 z-50">
      <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-cyan-400 tracking-wider text-center xl:text-left">
        THE EARTH INFORMATION JUKEBOX
      </h1>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 bg-[#1a2332] p-3 rounded-xl border border-gray-700 shadow-lg w-full xl:w-auto">
        {/* Auto-complete Search Box */}
        <div className="relative flex items-center gap-2 bg-[#0a0f18] px-3 py-1.5 rounded-lg border border-gray-800 w-full md:w-auto">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-cyan-500" />
          )}

          <input
            type="text"
            placeholder="Search city (e.g. Sittwe)"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="bg-transparent text-cyan-300 text-sm focus:outline-none placeholder-gray-600 flex-1 min-w-[180px]"
          />

          {/* Dropdown Menu */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#1a2332] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[100]">
              {searchResults.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-cyan-400 cursor-pointer border-b border-gray-800 last:border-0 truncate"
                >
                  {loc.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lat / Lon (Auto-filled) */}
        <div className="flex items-center gap-2 bg-[#0a0f18] px-3 py-1.5 rounded-lg border border-gray-800 w-full md:w-auto justify-center">
          <MapPin className="w-4 h-4 text-cyan-500 hidden sm:block" />
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-gray-500 uppercase">Lat</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-14 sm:w-16 bg-transparent text-cyan-300 text-sm focus:outline-none text-center"
            />
          </div>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-gray-500 uppercase">Lon</label>
            <input
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-14 sm:w-16 bg-transparent text-cyan-300 text-sm focus:outline-none text-center"
            />
          </div>
        </div>

        {/* Date Inputs */}
        <div className="flex items-center gap-2 bg-[#0a0f18] px-3 py-1.5 rounded-lg border border-gray-800 w-full md:w-auto justify-center">
          <Calendar className="w-4 h-4 text-cyan-500 hidden sm:block" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-cyan-300 text-sm focus:outline-none"
            style={{ colorScheme: "dark" }}
          />
          <span className="text-gray-600">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-cyan-300 text-sm focus:outline-none"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <button
          onClick={onLoadData}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition disabled:opacity-50 w-full md:w-auto"
        >
          <Database className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Load Data"}
        </button>
      </div>
    </header>
  );
}
