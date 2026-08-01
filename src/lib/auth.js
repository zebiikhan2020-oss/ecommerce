import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(roles = []) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Unauthorized", status: 401, user: null };
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { error: "Forbidden", status: 403, user: null };
  }
  return { error: null, status: 200, user };
}
