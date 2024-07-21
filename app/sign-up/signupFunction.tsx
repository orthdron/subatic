import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signup(formData: FormData): Promise<ActionResult> {
    "use server";
    const username = formData.get("username");
    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return {
            error: "Invalid username"
        };
    }

    const email = formData.get("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
        return {
            error: "Invalid email format"
        };
    }

    const password = formData.get("password");
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
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
            eb('user.email', '=', username.toLowerCase())
        ])).limit(1).execute();
    if (existingUser.length > 0) {
        return {
            error: "User already exists"
        }
    }

    db.insertInto("user").values({
        id: userId,
        email: email,
        userName: username,
        passwordHash: passwordHash
    }).executeTakeFirstOrThrow();
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}

interface ActionResult {
    error: string;
}

export default signup;