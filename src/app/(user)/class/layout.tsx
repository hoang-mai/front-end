

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lớp học",
    description: "Lớp học",
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
