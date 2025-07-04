
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      const { payload } = await jwtVerify(token, secret);
      decodedToken = payload;
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const events = await eventsCollection.find({ userId: decodedToken.userId })
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching my events:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
