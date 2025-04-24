
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Quản lý lớp học",
  description: "Quản lý lớp học",
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
