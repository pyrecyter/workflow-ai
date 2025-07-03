
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import { registrationSchema } from '@/utils/validator';

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const users = db.collection('user');

    const body = await req.json();
    const { error } = registrationSchema.validate(body);

    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const { firstName, lastName, email, password } = body;

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
