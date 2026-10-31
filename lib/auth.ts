import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db";

export const roles = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
export type Role = (typeof roles)[number];
export type UserStatus = "ACTIVE" | "INACTIVE";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
};
export type AuthUserWithPassword = AuthUser & { passwordHash: string };

const sessionCookieName = "admin_session";
const sessionDurationSeconds = 60 * 60 * 8;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function createInitialUser() {
  const database = getDatabase();
  const existingUser = await database.user.findFirst({ select: { id: true } });
  if (existingUser) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Super Admin";
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL i ADMIN_PASSWORD moraju biti postavljeni za prvi admin nalog.");
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  await database.user.create({
    data: { name, email: email.trim().toLowerCase(), passwordHash, role: "SUPER_ADMIN", status: "ACTIVE" },
  });
}

async function ensureDatabase() {
  const database = getDatabase();
  await createInitialUser();
  await database.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  return database;
}

export async function findUserByEmail(email: string): Promise<AuthUserWithPassword | null> {
  return await (await ensureDatabase()).user.findUnique({
    where: { email: email.trim().toLowerCase() },
  }) as AuthUserWithPassword | null;
}

export async function createSession(userId: number) {
  const database = await ensureDatabase();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);
  await database.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } });
  return { token, expiresAt };
}

export async function getCurrentUser() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await (await ensureDatabase()).session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, name: true, email: true, role: true, status: true } } },
  });
  const user = session && session.expiresAt > new Date() ? session.user as AuthUser : null;

  if (!user || user.status !== "ACTIVE") return null;
  return user;
}

export function setSessionCookie(response: { cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void } }, token: string, expiresAt: Date) {
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearSession(token: string | undefined) {
  if (token) {
    await ensureDatabase().then((database) => database.session.deleteMany({ where: { tokenHash: hashToken(token) } }));
  }
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export { sessionCookieName };
