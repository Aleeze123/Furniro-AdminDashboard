

import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const { email, password } = await request.json();


    

    const validEmail = process.env.EMAIL;
    const validPassword = process.env.PASSWORD;
    if (!validEmail || !validPassword) {
      return NextResponse.json(
        { error: "Server misconfiguration: Missing credentials" },
        { status: 500 }
      );
    }

    if (email === validEmail && password === validPassword) {
      cookieStore.set("isAuthenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, 
      });

      return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}