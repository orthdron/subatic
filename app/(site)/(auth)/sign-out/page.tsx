import { lucia, validateRequest } from "@/lib/auth";
import { Session } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function resetCookie(session: Session) {
    "use server";
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export default async function Page() {
    const { session } = await validateRequest();
    if (!session) {
        return redirect("/");
    }
    resetCookie(session);
    return redirect("/");
}
