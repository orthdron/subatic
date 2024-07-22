import { lucia, validateRequest } from "@/lib/auth";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logout(): Promise<ActionResult> {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}
export default logout;