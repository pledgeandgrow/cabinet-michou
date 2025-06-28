"use server"
import { getIronSession } from "iron-session";
import { defaultSession, SessionData, sessionOptions } from "./lib";
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";
import { getAdmin } from "@/lib/auth-db";

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

  try {
    const user = await getAdmin(login);
    
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      session.isLoggedIn = true;
      session.user = { id: user.id, login: user.login };

      await session.save();
      return { success: true, message: "Logged in successfully" };
    } else {
      return { success: false, message: "Incorrect password" };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: "Une erreur est survenue" };
  }
};

export const logout = async () => {
  const session = await getSession();
  session.destroy(); 
  return { success: true, message: "Logged out successfully" };
};
