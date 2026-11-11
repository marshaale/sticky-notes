import { connection, NextResponse } from "next/server";

// GET /api/health
// The deploy script calls this after every restart. If it answers
// {"status":"ok"}, the new version is running and the deploy is kept.
export async function GET() {
  // Wait for a real request, so this is checked live and never cached.
  await connection();

  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}
