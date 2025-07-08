import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const events = await eventsCollection
      .find({ userId: userId })
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching my events:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
