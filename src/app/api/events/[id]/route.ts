
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { jwtVerify } from 'jose';
import { eventSchema } from '@/utils/validator';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyTokenAndGetUserId(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return { userId: null, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId, response: null };
  } catch (error) {
    return { userId: null, response: NextResponse.json({ message: 'Invalid token' }, { status: 401 }) };
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

    const db = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const { id } = params;
    const body = await req.json();

    // Add userId to body for validation, ensuring user can only update their own events
    body.userId = userId;

    const { error } = eventSchema.validate(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id), userId: userId },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

    const db = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const { id } = params;

    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id), userId: userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
