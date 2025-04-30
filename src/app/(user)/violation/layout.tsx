

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vi phạm",
    description: "Vi phạm",
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
