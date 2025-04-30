

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý quản lý học viên",
    description: "Quản lý quản lý học viên",
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <>


            {children}
        </>


    );
}
