import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { profileUpdateSchema, passwordChangeSchema } from "@/utils/validator";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyTokenAndGetUserId(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return {
      userId: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    const userIdString = String(payload.userId);
    if (!ObjectId.isValid(userIdString)) {
      return {
        userId: null,
        response: NextResponse.json(
          {
            message:
              "Invalid token payload: userId is not a valid ObjectId string",
          },
          { status: 401 }
        ),
      };
    }
    const userId = new ObjectId(userIdString); // Convert to ObjectId
    return { userId, response: null };
  } catch {
    return {
      userId: null,
      response: NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      ),
    };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Corrected to 'users'

    const user = await usersCollection.findOne(
      { _id: userId },
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
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

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
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        // Compare ObjectId to string
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    const result = await usersCollection.updateOne(
      { _id: userId },
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
    const { userId, response } = await verifyTokenAndGetUserId(req);
    if (!userId) return response;

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

    const user = await usersCollection.findOne({ _id: userId });

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
      { _id: userId },
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
