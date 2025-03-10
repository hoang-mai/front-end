import Header from "./header";
import LeftSidebar from "./leftSidebar";
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
          <div className='xl:w-[80%] xl:p-4 md:w-[90%] md:p-4  flex flex-col gap-4 h-fit my-4 bg-white rounded-lg'>
            {children}
          </div>
        </article>
      </main>
    </>
  );
}
