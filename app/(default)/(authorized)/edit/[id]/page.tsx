import EditVideoForm from "@/components/forms/EditForm";
import { db } from "@/database/db";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Subatic - Edit video',
    description:
        'Edit your subatic video',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

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