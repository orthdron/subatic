import { db } from "@/database/db";
import { lucia } from "@/lib/auth";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData): Promise<ActionResult> {
    "use server";
    const username = formData.get("username");
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
    const password = formData.get("password");
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }

    const existingUser = await db.selectFrom("user")
        .selectAll()
        .where((eb) => eb.or([
            eb('user.userName', '=', username.toLowerCase()),
            eb('user.email', '=', username.toLowerCase())
        ])).limit(1).execute();

    if (existingUser.length == 0) {
        return {
            error: "Incorrect username or password"
        };
    }
    const matchedUser = existingUser[0];

    const validPassword = await verify(matchedUser.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return {
            error: "Incorrect username or password"
        };
    }

    const session = await lucia.createSession(matchedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}

interface ActionResult {
    error: string;
}

export default login;