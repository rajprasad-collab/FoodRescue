import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#26352f]">
      <Sidebar />

      <Topbar />

      <main className="ml-64 min-h-screen pt-20">
        <div className="mx-auto max-w-[1600px] px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}