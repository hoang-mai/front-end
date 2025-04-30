

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lớp quản lý",
    description: "Lớp quản lý",
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
