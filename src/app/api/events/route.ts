import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { eventSchema } from "@/utils/validator";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decodedToken;
    try {
      const { payload } = await jwtVerify(token, secret);
      decodedToken = payload;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const body = await req.json();

    // Add userId from decoded token to the body for validation
    body.userId = decodedToken.userId;

    const { error } = eventSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const newEvent = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(newEvent);

    return NextResponse.json(
      { message: "Event created successfully", eventId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const eventsCollection = db.collection("events");

    const events = await eventsCollection
      .find()
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
