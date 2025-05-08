

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quân tư trang",
    description: "Quân tư trang",
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
