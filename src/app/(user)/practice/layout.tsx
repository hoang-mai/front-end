

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rèn luyện",
    description: "Rèn luyện",
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
