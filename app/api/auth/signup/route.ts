import { db } from "@/database/db";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
export async function POST(req: Request) {
    const formData = await req.json();

    const username = formData.username;
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    const email = formData.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }


    const password = formData.password;
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return NextResponse.json({ error: "Invalid password length" }, { status: 400 });
    }

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long


    const existingUser = await db.selectFrom("user")
        .selectAll()
        .where((eb) => eb.or([
            eb('user.userName', '=', username.toLowerCase()),
            eb('user.email', '=', email.toLowerCase())
        ])).limit(1).execute();
    if (existingUser.length > 0) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await db.insertInto("user").values({
        id: userId,
        email: email.toLowerCase(),
        userName: username.toLowerCase(),
        passwordHash: passwordHash
    }).executeTakeFirstOrThrow();
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ sucess: "Signup successful." }, { status: 200 });
}
