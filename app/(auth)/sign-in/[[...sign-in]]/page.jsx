import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
    const { userId } = await auth();

    if (userId) {
        redirect("/dashboard");
    }

    return (
        <div className="grid h-screen grid-cols-1 overflow-hidden md:grid-cols-2">
            <div className="relative hidden h-full min-h-0 items-center justify-center md:flex">
                <Image
                    src="/login.png"
                    alt="AI Reels Pro"
                    width={500}
                    height={500}
                    className="h-full w-full object-contain"
                    priority
                />
            </div>
            <div className="flex h-full min-h-0 items-center justify-center p-4 md:p-8">
                <SignIn
                    routing="path"
                    path="/sign-in"
                    forceRedirectUrl="/dashboard"
                    fallbackRedirectUrl="/dashboard"
                />
            </div>
        </div>
    )
}