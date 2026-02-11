import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title={title} />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
