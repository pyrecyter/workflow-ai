
import { logout } from './actions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <form action={logout}>
          <button type="submit" className="px-4 py-2 font-bold text-white bg-red-500 rounded-md">
            Logout
          </button>
        </form>
      </nav>
      <main className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <p className="text-center">Welcome to your dashboard!</p>
        </div>
      </main>
    </div>
  );
}
