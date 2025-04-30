

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý trợ cấp - Học viên",
    description: "Quản lý trợ cấp",
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
