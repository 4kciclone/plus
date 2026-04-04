"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface LocationContextType {
  city: string;
  stateCode: string;
  isValenca: boolean;
  loading: boolean;
  detectLocation: () => Promise<void>;
  setCityManually: (city: string, stateCode: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STATE_MAP: Record<string, string> = {
  "acre": "AC", "alagoas": "AL", "amapá": "AP", "amazonas": "AM", "bahia": "BA",
  "ceará": "CE", "distrito federal": "DF", "espírito santo": "ES", "goiás": "GO",
  "maranhão": "MA", "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG",
  "pará": "PA", "paraíba": "PB", "paraná": "PR", "pernambuco": "PE", "piauí": "PI",
  "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS",
  "rondônia": "RO", "roraima": "RR", "santa catarina": "SC", "são paulo": "SP",
  "sergipe": "SE", "tocantins": "TO",
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState("Localização");
  const [stateCode, setStateCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isValenca = city.toLowerCase().includes("valença");

  // Load from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("plus-city");
    const savedState = localStorage.getItem("plus-state");
    if (savedCity && savedState) {
      setCity(savedCity);
      setStateCode(savedState);
    } else {
      // Auto-detect silently based on IP without prompting GPS permission immediately
      fetch("https://ipwho.is/")
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.city && data.region_code) {
            setCity(data.city);
            setStateCode(data.region_code);
          }
        })
        .catch(err => console.warn("Auto-IP detection warning:", err));
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    
    setLoading(true);
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`,
              { headers: { "User-Agent": "PlusInternet/1.0" } }
            );
            const data = await res.json();
            
            const detectedCity = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || "Localização";
            const stateName = (data.address?.state || "").toLowerCase();
            const detectedState = data.address?.state_code?.toUpperCase() || STATE_MAP[stateName] || "RJ";

            setCity(detectedCity);
            setStateCode(detectedState);
            localStorage.setItem("plus-city", detectedCity);
            localStorage.setItem("plus-state", detectedState);
          } catch (error) {
            console.error("Geocoding error:", error);
          } finally {
            setLoading(false);
            resolve();
          }
        },
        (error) => {
          // Fallback to IP geolocation silently
          console.warn("Geolocation warning:", error.message, "- Trying IP Fallback...");
          fetch("https://ipwho.is/")
            .then(res => res.json())
            .then(data => {
              if (data && data.success && data.city && data.region_code) {
                setCity(data.city);
                setStateCode(data.region_code);
                localStorage.setItem("plus-city", data.city);
                localStorage.setItem("plus-state", data.region_code);
              }
            })
            .catch(ipErr => console.warn("IP Geolocation fallback failed:", ipErr))
            .finally(() => {
              setLoading(false);
              resolve();
            });
        },
        { timeout: 8000 }
      );
    });
  }, []);

  const setCityManually = (newCity: string, newState: string) => {
    setCity(newCity);
    setStateCode(newState);
    localStorage.setItem("plus-city", newCity);
    localStorage.setItem("plus-state", newState);
  };

  return (
    <LocationContext.Provider value={{ city, stateCode, isValenca, loading, detectLocation, setCityManually }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
