import Navigator from "./navigator";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý trợ cấp - Chưa nhận",
  description: "Quản lý trợ cấp",
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    

    return (

        <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md p-4 mb-4 lg:p-6 md:p-4">

            <Navigator/>
            
            {children}
        </div>


    );
}
