import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { profileUpdateSchema, passwordChangeSchema } from "@/utils/validator";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Corrected to 'users'

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId as string) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Corrected to 'users'

    const body = await req.json();
    const { error } = profileUpdateSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, ...updateData } = body;

    // Check if email is being updated and if it already exists
    if (email) {
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        // Compare ObjectId to string
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId as string) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Corrected to 'users'

    const body = await req.json();
    const { error } = passwordChangeSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = body;

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId as string),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid current password" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await usersCollection.updateOne(
      { _id: new ObjectId(userId as string) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
