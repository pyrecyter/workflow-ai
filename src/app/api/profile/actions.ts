"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectToDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function fetchUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { user: null, error: "Unauthorized" };
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userIdString = String(payload.userId);
    if (!ObjectId.isValid(userIdString)) {
      return {
        user: null,
        error: "Invalid token payload: userId is not a valid ObjectId string",
      };
    }
    const userId = new ObjectId(userIdString);

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return { user: null, error: "User not found" };
    }

    // Convert _id to string before returning
    return {
      user: { ...user, _id: user._id.toString() } as {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching user profile in action:", error);
    return {
      user: null,
      error: error.message || "Failed to fetch user profile",
    };
  }
}
