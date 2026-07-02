import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

// 백엔드(FastAPI) 프록시 역할을 하는 API Route
export async function GET(request: NextRequest) {
  const query = new URL(request.url).search;
  const res = await fetch(`${BACKEND_API_URL}/todos${query}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

