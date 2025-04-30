

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thông tin cá nhân",
    description: "Thông tin cá nhân",
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
