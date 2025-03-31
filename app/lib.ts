import exp from "constants";
import { SessionOptions } from "iron-session";


export interface SessionData {
	isLoggedIn: boolean;
	user?: {
		id: number;
		login: string;
	  };
}

export const defaultSession:SessionData={
	isLoggedIn : false
}
export const sessionOptions:SessionOptions={
	password : process.env.SECRET_KEY!,
	cookieName :"michou_cookie",
	cookieOptions:{
		httpOnly:true,
		secure: process.env.NODE_ENV === "production",
	}
}