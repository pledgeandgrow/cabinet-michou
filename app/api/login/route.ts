import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const supabase = getSupabaseClient();
    
    // Récupérer l'administrateur avec le nom d'utilisateur fourni
    const { data: admins, error } = await supabase
      .from('admin')
      .select('*')
      .eq('login', username);
    
    if (error) {
      console.error("Erreur lors de la récupération de l'administrateur:", error);
      return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
    
    if (!admins || admins.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    
    const admin = admins[0];
    
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    
    // Ajouter des en-têtes pour désactiver la mise en cache
    const headers = {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    const response = NextResponse.json({ message: "Logged in" }, { headers });
    response.cookies.set({
      name: "admin_token",
      value: "valid-token", 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
