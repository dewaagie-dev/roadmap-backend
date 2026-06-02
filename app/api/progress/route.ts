import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { progress, notes } from "@/lib/schema";

// GET /api/progress — fetch all progress + notes
export async function GET() {
  try {
    const [allProgress, allNotes] = await Promise.all([
      db.select().from(progress),
      db.select().from(notes),
    ]);

    const doneMap: Record<string, boolean> = {};
    for (const row of allProgress) {
      if (row.isDone) doneMap[row.dayId] = true;
    }

    const notesMap: Record<string, string> = {};
    for (const row of allNotes) {
      notesMap[row.dayId] = row.content;
    }

    return NextResponse.json({ done: doneMap, notes: notesMap });
  } catch (err) {
    console.error("GET /api/progress error:", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
