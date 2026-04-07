import jwt from "jsonwebtoken";

export function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: number };

    return decoded;
  } catch {
    return null;
  }
}
