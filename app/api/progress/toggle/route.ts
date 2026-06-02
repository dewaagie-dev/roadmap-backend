import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { progress } from "@/lib/schema";
import { eq } from "drizzle-orm";

// POST /api/progress/toggle  { dayId, isDone }
export async function POST(req: NextRequest) {
  try {
    const { dayId, isDone } = await req.json();
    if (!dayId || typeof isDone !== "boolean") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // Upsert: insert or update
    const existing = await db
      .select()
      .from(progress)
      .where(eq(progress.dayId, dayId))
      .get();

    if (existing) {
      await db
        .update(progress)
        .set({ isDone, completedAt: isDone ? new Date().toISOString() : null })
        .where(eq(progress.dayId, dayId));
    } else {
      await db.insert(progress).values({
        dayId,
        isDone,
        completedAt: isDone ? new Date().toISOString() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/progress/toggle error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
