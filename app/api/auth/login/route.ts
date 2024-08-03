import { db } from "@/database/db";
import { lucia } from "@/lib/auth";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

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

    const password = formData.password;
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const existingUser = await db
        .selectFrom("user")
        .selectAll()
        .where((eb) =>
            eb.or([
                eb("user.userName", "=", username.toLowerCase()),
                eb("user.email", "=", username.toLowerCase())
            ])
        )
        .limit(1)
        .execute();

    if (existingUser.length == 0) {
        return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    const matchedUser = existingUser[0];

    const validPassword = await verify(matchedUser.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    const session = await lucia.createSession(matchedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ sucess: "Login successful." }, { status: 200 });
}
