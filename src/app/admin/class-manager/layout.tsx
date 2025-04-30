
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Quản lý lớp quản lý",
  description: "Quản lý lớp quản lý",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  return (
    <>
      
            {children}
          
    </>
  );
}
