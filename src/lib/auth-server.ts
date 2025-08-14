import { headers } from "next/headers";
import { auth } from "./auth"; // path to your Better Auth server instance
 
export const authServer = auth.api;

export const getServerSession = async () => {
  const session = await authServer.getSession({
    headers: await headers()
  })
  return session;
};  