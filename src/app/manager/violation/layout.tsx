

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý vi phạm",
    description: "Quản lý vi phạm",
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
