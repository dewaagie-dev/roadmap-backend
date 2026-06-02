import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq } from "drizzle-orm";

// POST /api/progress/note  { dayId, content }
export async function POST(req: NextRequest) {
  try {
    const { dayId, content } = await req.json();
    if (!dayId || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const updatedAt = new Date().toISOString();

    const existing = await db
      .select()
      .from(notes)
      .where(eq(notes.dayId, dayId))
      .get();

    if (existing) {
      await db
        .update(notes)
        .set({ content, updatedAt })
        .where(eq(notes.dayId, dayId));
    } else {
      await db.insert(notes).values({ dayId, content, updatedAt });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/progress/note error:", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
