import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] w-full">
            <Sidebar />
            <main className="dashboard-container flex-1 flex flex-col min-w-0 pl-12 md:pl-0">
                {children}
            </main>
        </div>
    );
}
