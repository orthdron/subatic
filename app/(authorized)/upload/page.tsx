import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateVideoForm from "./createVideoForm";

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
