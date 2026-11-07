// File: src/services/nasaApi.ts

import axios from "axios";

// ==========================================
// 1. TypeScript Interfaces (Types)
// ==========================================

// အခြား Component များမှ Import ခေါ်သုံးနိုင်ရန် `export` ထည့်ထားပါသည်။
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

// ==========================================
// 2. OpenStreetMap Geocoding API
// ==========================================
// မြို့အမည်ရိုက်ထည့်လိုက်လျှင် Lat/Lon နှင့်တကွ ရွေးချယ်စရာ ၅ ခု ပြန်ပေးပါမည်။

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

// ==========================================
// 3. NASA POWER API
// ==========================================
// Lat, Lon နှင့် ရက်စွဲကို အခြေခံ၍ လေတိုက်နှုန်းနှင့် မိုးရေချိန်ကို ပြန်ပေးပါမည်။

export const fetchNasaWeather = async (
  lat: string,
  lon: string,
  startDate: string,
  endDate: string,
): Promise<WeatherData[]> => {
  try {
    // NASA API သည် ရက်စွဲကို YYYY-MM-DD အစား YYYYMMDD format ဖြင့်သာ လက်ခံပါသည်။
    const formatStart = startDate.replace(/-/g, "");
    const formatEnd = endDate.replace(/-/g, "");

    const response = await axios.get(
      "https://power.larc.nasa.gov/api/temporal/hourly/point",
      {
        params: {
          parameters: "WS10M,PRECTOTCORR", // WS10M = Wind, PRECTOTCORR = Rain
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

    // UI တွင် အလွယ်တကူ Map လှည့်၍ သုံးနိုင်ရန် Array of Objects အဖြစ် ပြောင်းပေးခြင်း
    return timestamps.map((time, index) => ({
      time,
      wind: windData[index],
      rain: rainData[index],
    }));
  } catch (error) {
    console.error("NASA API Error:", error);
    throw error; // UI တွင် Alert ပြနိုင်ရန် Error ကို throw လုပ်ပေးပါသည်။
  }
};
