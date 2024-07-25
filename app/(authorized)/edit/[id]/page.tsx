import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditVideoForm from "./editForm";

export default async function Page({ params }: { params: { id: string } }) {

    const { user } = await validateRequest();
    if (!user) {
        return redirect("/");
    }
    const videos = await db.selectFrom('video')
        .selectAll()
        .where('userId', '=', user.id)
        .where('id', '=', params.id)
        .execute();

    if (videos.length != 1) {
        return redirect("/");
    }
    const { id, title, description } = videos[0];

    return (
        <>
            <div className="mx-32">
                <EditVideoForm video={{ id, title, description }} />
            </div>
        </>
    );
}