
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Quản lý rèn luyện",
  description: "Quản lý rèn luyện",
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
