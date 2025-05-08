
import Navbar from "./navBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (

    <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md p-4 mb-4 lg:p-6 md:p-4">

      <Navbar />

      {children}
    </div>
  );
}
