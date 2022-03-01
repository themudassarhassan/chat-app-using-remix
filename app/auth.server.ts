import { createCookieSessionStorage, json, redirect } from 'remix';
import bcrypt from 'bcryptjs';
import { db } from './db.server';

export const sessionKey = 'remix-chat-app';
export const userSessionKey = 'session-key';

export async function login(request: Request, options: { redirect: string }) {
  const formData = await request.formData();
  
  const email = formData.get('email');
  const password = formData.get('password');
 
  if (typeof email !== "string") return json("email is not valid", { status: 400 });
  if (typeof password !== "string") return json("password is not valid", { status: 400 });
  
  const user = await db.user.findUnique({ where: { email }});
  
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return json("email or password is not correct", { status: 400 });
  }
  
  return await createUserSession(user.id, options);
}

export async function register(request: Request, options: { redirect: string }) {
  const formData = await request.formData();
  
  const email = formData.get('email');
  const name = formData.get('name');
  const password = formData.get('password');
  
  if (typeof email !== "string") return json("email is not valid", { status: 400 });
  if (typeof name !== "string") return json("name is not valid", { status: 400 });
  if (typeof password !== "string") return json("password is not valid", { status: 400 });
  
  const existingUser = await db.user.findUnique({ where: { email } });
  
  if (existingUser) {
    return json("user already exists", { status: 400 });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({ data: { email, name, passwordHash }});
  
  return await createUserSession(newUser.id, options);
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: sessionKey,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cr3t'], // This should be an env variable
    secure: process.env.NODE_ENV === 'production',
  },
})

function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function logout(request: Request, opts: { redirect: string }) {
  const session = await getUserSession(request);
  return redirect(opts.redirect, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

export async function requireUser(request: Request, opts: { redirectTo: string }) {
  const userSession = await getUserSession(request);
  const userId = userSession.get(userSessionKey);
  
  const user = await db.user.findUnique({ where: { id: userId } })

  if (!user) throw redirect(opts.redirectTo);
  
  return user;
}

export async function createUserSession(userId: number, opts: { redirect: string }) {
  const session = await sessionStorage.getSession();
  session.set(userSessionKey, userId);
  return redirect(opts.redirect, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}
