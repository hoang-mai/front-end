

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trợ cấp",
    description: "Trợ cấp",
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
