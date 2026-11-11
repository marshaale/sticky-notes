import { NextResponse } from "next/server";
import { mutate } from "../../../../lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const updated = await mutate((notes) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return null;
    if (typeof body.text === "string") note.text = body.text.slice(0, 2000);
    if (typeof body.color === "string") note.color = body.color;
    return note;
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  await mutate((notes) => {
    const i = notes.findIndex((n) => n.id === id);
    if (i !== -1) notes.splice(i, 1);
  });
  return NextResponse.json({ ok: true });
}
