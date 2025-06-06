import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };
// Do NOT export authOptions
