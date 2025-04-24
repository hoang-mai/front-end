import Header from "./header";
import LeftSidebar from "./leftSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý học kỳ",
  description: "Quản lý học kỳ",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Header />
      <main className='flex flex-row max-w-screen-2xl mx-auto h-[calc(100vh-60px)]'>
        <LeftSidebar />
        <article className='flex-1 flex justify-center overflow-y-auto '>
          <div className='w-full flex flex-col gap-4 h-fit my-4 justify-center items-center'>
            {children}
          </div>
        </article>
      </main>
    </>
  );
}
