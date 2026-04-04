import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ip-api.com works on HTTP for server-side (free tier allows HTTP)
    const res = await fetch("http://ip-api.com/json/?fields=status,city,region,regionName", {
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

