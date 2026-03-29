"use client";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

// Accurate coordinates for neighborhoods in Valença/RJ and surroundings
const NEIGHBORHOODS = [
  { name: "Centro", lat: -22.2433, lng: -43.7003, popular: true },
  { name: "Jardim Valença", lat: -22.2510, lng: -43.7080 },
  { name: "Parque Pentagna", lat: -22.2390, lng: -43.7150 },
  { name: "Santa Cruz", lat: -22.2360, lng: -43.7250 },
  { name: "Biquinha", lat: -22.2300, lng: -43.6920 },
  { name: "Fátima", lat: -22.2480, lng: -43.6950 },
  { name: "São Cristóvão", lat: -22.2550, lng: -43.6900 },
  { name: "Varginha", lat: -22.2600, lng: -43.7050 },
  { name: "Benfica", lat: -22.2580, lng: -43.6800 },
  { name: "Aparecida", lat: -22.2640, lng: -43.6960 },
  { name: "Laranjeiras", lat: -22.2350, lng: -43.6850 },
  { name: "Cruzeiro", lat: -22.2290, lng: -43.7000 },
  { name: "Osório", lat: -22.2470, lng: -43.7200 },
  { name: "Monte Belo", lat: -22.2560, lng: -43.7200 },
  { name: "Monte Douro", lat: -22.2630, lng: -43.7120 },
  { name: "Ponte Funda", lat: -22.2330, lng: -43.7090 },
  { name: "Serra da Glória", lat: -22.2200, lng: -43.7150 },
  { name: "Água Fria", lat: -22.2190, lng: -43.6950 },
  { name: "Barroso", lat: -22.2180, lng: -43.7040 },
  { name: "Alicacio", lat: -22.2420, lng: -43.6850 },
  { name: "Belo Horizonte", lat: -22.2700, lng: -43.7020 },
  { name: "Carambita (Av Duque Costa)", lat: -22.2455, lng: -43.7240 },
  { name: "Jardim Dona Angelina", lat: -22.2520, lng: -43.7160 },
  { name: "João Bonito (cond. Vieira)", lat: -22.2380, lng: -43.7180 },
  { name: "João Dias", lat: -22.2610, lng: -43.6890 },
  { name: "São José das Palmeiras", lat: -22.2680, lng: -43.6830 },
  { name: "Spalla 1", lat: -22.2500, lng: -43.7260 },
  { name: "Spalla 2", lat: -22.2520, lng: -43.7300 },
  { name: "Torres Homem", lat: -22.2440, lng: -43.7310 },
  { name: "Vadinho Fonseca", lat: -22.2370, lng: -43.7140 },
];

// Leaflet must be loaded client-side only in Next.js
export default function CoverageMap() {
  const [MapComponents, setMapComponents] = useState<null | {
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Marker: typeof import("react-leaflet")["Marker"];
    Popup: typeof import("react-leaflet")["Popup"];
    Circle: typeof import("react-leaflet")["Circle"];
  }>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    // Import Leaflet only on client
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, leaflet]) => {
      // Fix default icon paths
      // @ts-expect-error leaflet internal
      delete leaflet.Icon.Default.prototype._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setL(leaflet);
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
        Circle: rl.Circle,
      });
    });
  }, []);

  const filtered = NEIGHBORHOODS.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  const customIcon = (isHighlighted: boolean, isPopular: boolean, leaflet: typeof import("leaflet")) =>
    leaflet.divIcon({
      className: "",
      html: `<div style="
        width: ${isHighlighted ? 20 : 16}px;
        height: ${isHighlighted ? 20 : 16}px;
        background: ${isHighlighted ? "#ff3db5" : isPopular ? "#E10098" : "#E10098"};
        border: 3px solid ${isHighlighted ? "#fff" : "rgba(255,255,255,0.8)"};
        border-radius: 50%;
        box-shadow: 0 0 0 ${isHighlighted ? "8px" : "4px"} rgba(225,0,152,0.25), 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s;
        cursor: pointer;
      "></div>`,
      iconSize: [isHighlighted ? 20 : 16, isHighlighted ? 20 : 16],
      iconAnchor: [isHighlighted ? 10 : 8, isHighlighted ? 10 : 8],
    });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <input
          type="text"
          placeholder="Pesquise seu bairro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-neutral-200 focus:border-primary focus:outline-none text-neutral-800 font-medium text-[15px] bg-white transition-colors"
        />
        {search && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-200 shadow-lg z-[1000] overflow-hidden">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-500 font-medium">Bairro não atendido ainda</div>
            ) : filtered.map(n => (
              <button
                key={n.name}
                onClick={() => { setHighlighted(n.name); setSearch(n.name); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                {n.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm" style={{ height: "480px" }}>
        {!MapComponents || !L ? (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm font-medium">Carregando mapa...</p>
            </div>
          </div>
        ) : (
          // @ts-expect-error types
          <MapComponents.MapContainer
            center={[-22.2500, -43.7100]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            {/* Carto Dark Matter tiles — no API key needed */}
            <MapComponents.TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Coverage overlay circle */}
            <MapComponents.Circle
              center={[-22.2480, -43.7100]}
              radius={3800}
              pathOptions={{
                color: "#E10098",
                fillColor: "#E10098",
                fillOpacity: 0.07,
                weight: 2,
                dashArray: "6 4",
                opacity: 0.4,
              }}
            />

            {/* Neighborhood pins */}
            {NEIGHBORHOODS.map((n) => (
              <MapComponents.Marker
                key={n.name}
                position={[n.lat, n.lng]}
                icon={customIcon(highlighted === n.name, !!n.popular, L)}
              >
                <MapComponents.Popup>
                  <div style={{ minWidth: "180px", fontFamily: "sans-serif" }}>
                    <p style={{ fontWeight: "800", fontSize: "15px", color: "#111", marginBottom: "4px" }}>
                      {n.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                      <div style={{ width: "8px", height: "8px", background: "#00E676", borderRadius: "50%" }} />
                      <span style={{ fontSize: "12px", color: "#555", fontWeight: "600" }}>Cobertura 100% Fibra</span>
                    </div>
                    <a
                      href="/cadastro"
                      style={{
                        display: "block", background: "#E10098", color: "white",
                        padding: "8px 12px", borderRadius: "20px", textAlign: "center",
                        fontSize: "13px", fontWeight: "700", textDecoration: "none",
                      }}
                    >
                      Assinar agora →
                    </a>
                  </div>
                </MapComponents.Popup>
              </MapComponents.Marker>
            ))}
          </MapComponents.MapContainer>
        )}
      </div>

      <p className="text-xs text-neutral-400 text-center font-medium">
        Clique em qualquer pin para ver a cobertura e assinar · {NEIGHBORHOODS.length} regiões atendidas
      </p>
    </div>
  );
}
