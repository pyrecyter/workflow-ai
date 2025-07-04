import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyTokenAndGetUserId(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return { userId: null, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    // Ensure userId is a string and a valid ObjectId string
    const userId = String(payload.userId);
    if (!ObjectId.isValid(userId)) {
      return { userId: null, response: NextResponse.json({ message: 'Invalid token payload: userId is not a valid ObjectId' }, { status: 401 }) };
    }
    return { userId, response: null };
  } catch (error) {
    return { userId: null, response: NextResponse.json({ message: 'Invalid token' }, { status: 401 }) };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

    const db = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const events = await eventsCollection.find({ userId: userId })
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching my events:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}