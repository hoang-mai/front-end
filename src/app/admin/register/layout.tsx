
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Tạo tài khoản mới",
  description: "Tạo tài khoản mới",
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
