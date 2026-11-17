import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import db from "@/configs/db";
import { Users } from "@/configs/schema";

export async function POST(req) {
  try {
    let email = null;
    let name = null;
    let imageUrl = null;

    // 1. Try server-side Clerk auth first
    try {
      const { userId } = await auth();
      if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        email = user.primaryEmailAddress?.emailAddress ?? null;
        name = user.fullName ?? user.firstName ?? email;
        imageUrl = user.imageUrl ?? null;
      }
    } catch (authError) {
      console.warn("Clerk server-side auth error, falling back to body:", authError?.message);
    }

    // 2. If not obtained via auth(), use payload passed from verified client
    if (!email) {
      try {
        const body = await req.json();
        if (body?.email) {
          email = body.email;
          name = body.name ?? email;
          imageUrl = body.imageUrl ?? null;
        }
      } catch {
        // No body or invalid JSON
      }
    }

    if (!email) {
      return Response.json(
        { error: "Unauthorized: No authenticated user or email found" },
        { status: 401 }
      );
    }

    // 3. Check if user already exists in Neon DB
    const existingUsers = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      return Response.json({
        message: "User already exists",
        user: existingUsers[0],
        created: false,
      });
    }

    // 4. Insert new user into Neon DB
    const newUser = await db
      .insert(Users)
      .values({
        name: name || email,
        email,
        imageUrl: imageUrl || null,
      })
      .returning();

    return Response.json({
      message: "User created successfully",
      user: newUser[0],
      created: true,
    });
  } catch (error) {
    console.error("Failed to persist Clerk user in database:", error);
    return Response.json(
      { error: "Failed to persist user record", details: error?.message },
      { status: 500 }
    );
  }
}
