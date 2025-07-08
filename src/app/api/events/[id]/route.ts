import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { eventSchema } from "@/utils/validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const { id } = await params;

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const { id } = await params;
    const body = await req.json();

    // Add userId to body for validation, ensuring user can only update their own events
    body.userId = userId;

    const { error } = eventSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id), userId: userId },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Event not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const { id } = await params;

    const result = await eventsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Event not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
