export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="flex items-center justify-center h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}