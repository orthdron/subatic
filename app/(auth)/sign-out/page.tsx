import logout from "@/utils/auth/logout";
import { redirect } from "next/navigation";

export default async function Page() {
    logout();
    return redirect("/");
}
