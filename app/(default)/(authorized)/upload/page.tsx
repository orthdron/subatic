import CreateVideoForm from "@/components/forms/CreateVideoForm";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Subatic - Upload video',
    description:
        'Upload new subatic video',
};

export default async function Page() {
    const { user } = await validateRequest();
    if (!user) {
        return redirect("/");
    }

    const maxFileSize = process.env.MAX_FILE_SIZE;

    return (
        <>
            <div className="p-10 md:mx-36">
                <h1 className="border-4 border-red-500">
                    Max File Size : {maxFileSize} MegaBytes
                </h1>
                <CreateVideoForm />
            </div>
        </>
    );
}
