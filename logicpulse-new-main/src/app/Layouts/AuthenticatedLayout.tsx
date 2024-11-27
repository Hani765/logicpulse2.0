import { PropsWithChildren, ReactNode } from "react";
import { User } from "@/types";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
export default function Authenticated({
    user,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    return (
        <>
            <AdminPanelLayout role={user.role} webName="LogicPules">
                <ContentLayout user={user}>{children} </ContentLayout>
            </AdminPanelLayout>
        </>
    );
}
