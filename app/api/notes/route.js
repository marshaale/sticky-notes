import { NextResponse } from "next/server";
import { readNotes, mutate } from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readNotes());
}

export async function POST(req) {
  const { color = "#fde68a" } = await req.json().catch(() => ({}));
  const note = {
    id: crypto.randomUUID(),
    text: "",
    color,
    createdAt: Date.now(),
  };
  await mutate((notes) => {
    notes.unshift(note);
  });
  return NextResponse.json(note, { status: 201 });
}
