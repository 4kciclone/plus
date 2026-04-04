import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    // Get real client IP from Vercel/proxy headers
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
      || headersList.get("x-real-ip")
      || "";

    // Use client IP to geolocate the actual user, not the server
    const url = clientIp
      ? `http://ip-api.com/json/${clientIp}?fields=status,city,region,regionName`
      : `http://ip-api.com/json/?fields=status,city,region,regionName`;

    const res = await fetch(url, {
      headers: { "User-Agent": "PlusInternet/1.0" },
    });
    const data = await res.json();

    if (data && data.status === "success" && data.city) {
      return NextResponse.json({
        city: data.city,
        region_code: data.region || "",
      });
    }

    return NextResponse.json({ city: "", region_code: "" });
  } catch {
    return NextResponse.json({ city: "", region_code: "" }, { status: 500 });
  }
}

