// File: src/services/nasaApi.ts

import axios from "axios";

// ==========================================
// 1. TypeScript Interfaces (Types)
// ==========================================

export interface WeatherData {
  time: string;
  wind: number;
  rain: number;
}

export interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

// Street Map

export const geocodeLocation = async (
  query: string,
): Promise<LocationResult[]> => {
  if (!query) return [];

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: query,
          format: "json",
          limit: 5,
        },
      },
    );

    return response.data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat).toFixed(2),
      lon: parseFloat(item.lon).toFixed(2),
    }));
  } catch (error) {
    console.error("Geocoding Error:", error);
    return [];
  }
};

export const fetchNasaWeather = async (
  lat: string,
  lon: string,
  startDate: string,
  endDate: string,
): Promise<WeatherData[]> => {
  try {
    //
    const formatStart = startDate.replace(/-/g, "");
    const formatEnd = endDate.replace(/-/g, "");

    const response = await axios.get(
      "https://power.larc.nasa.gov/api/temporal/hourly/point",
      {
        params: {
          parameters: "WS10M,PRECTOTCORR",
          community: "RE",
          longitude: parseFloat(lon),
          latitude: parseFloat(lat),
          start: formatStart,
          end: formatEnd,
          format: "JSON",
        },
      },
    );

    const paramData = response.data.properties.parameter;
    const windData = Object.values(paramData.WS10M) as number[];
    const rainData = Object.values(paramData.PRECTOTCORR) as number[];
    const timestamps = Object.keys(paramData.WS10M);

    return timestamps.map((time, index) => ({
      time,
      wind: windData[index],
      rain: rainData[index],
    }));
  } catch (error) {
    console.error("NASA API Error:", error);
    throw error;
  }
};
