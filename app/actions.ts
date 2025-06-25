"use server"
import { getIronSession } from "iron-session";
import { defaultSession, SessionData, sessionOptions } from "./lib";
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";
import { query } from "@/lib/auth-db";

export async function getSessionStatus() {
	const session = await getSession()
	// Only return the boolean value
	return session.isLoggedIn
  }
  
export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};

export const login = async (data: { login: string, password: string }) => {
  const session = await getSession();
  const { login, password } = data;  

  const results = await query<RowDataPacket[]>({
    query: "SELECT * FROM admin WHERE login = ?",
    values: [login],
  });

  if (results.length > 0) {
    const user = results[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      session.isLoggedIn = true;
      session.user = { id: user.id, login: user.login };

      await session.save();
      return { success: true, message: "Logged in successfully" };
    } else {
      return { success: false, message: "Incorrect password" };
    }
  } else {
    return { success: false, message: "User not found" };
  }
};

export const logout = async () => {
  const session = await getSession();
  session.destroy(); 
  return { success: true, message: "Logged out successfully" };
};
