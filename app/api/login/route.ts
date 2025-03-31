import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { query } from "@/lib/db"; 

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const results = await query({
    query: "SELECT * FROM admin WHERE login = ?",
    values: [username],
  });

  if (results.length === 0) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const admin = results[0];

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Logged in" });
  response.cookies.set({
    name: "admin_token",
    value: "valid-token", 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
