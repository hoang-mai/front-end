

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý trợ cấp - Tất cả",
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
