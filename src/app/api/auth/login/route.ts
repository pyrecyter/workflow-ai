
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { loginSchema } from '@/utils/validator';

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const users = db.collection('user');

    const body = await req.json();
    const { error } = loginSchema.validate(body);

    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const { email, password } = body;

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
