
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Quản lý quân tư trang",
  description: "Quản lý quân tư trang",
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
