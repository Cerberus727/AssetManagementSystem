import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageLayout({
  title,
  children,
}) {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">
              {title}
            </h1>

            <div className="h-1 w-20 bg-orange-500 mt-2 rounded-full" />
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}