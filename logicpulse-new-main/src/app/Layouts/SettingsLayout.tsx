import { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SettingsNavigation from "@/components/settings/navigation";

export default function SettingsLayout({
    children,
    auth,
    head,
}: {
    children: ReactNode;
    auth: any;
    head: string;
}) {
    return (
        <>
            <Authenticated user={auth.user}>
                <Head title={head} />
                <SettingsNavigation />
                {children}
            </Authenticated>
        </>
    );
}
