import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://ipwho.is/", {
      headers: { "User-Agent": "PlusInternet/1.0" },
    });
    const data = await res.json();

    if (data && data.success) {
      return NextResponse.json({
        city: data.city || "",
        region_code: data.region_code || "",
      });
    }

    return NextResponse.json({ city: "", region_code: "" });
  } catch {
    return NextResponse.json({ city: "", region_code: "" }, { status: 500 });
  }
}
