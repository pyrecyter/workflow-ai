import { UserProvider } from "@/context/UserContext";
import { fetchUserProfile } from "@/app/api/profile/actions";
import DashboardNavbar from "@/components/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: initialUser, error } = await fetchUserProfile();

  // Handle error if user is not found or unauthorized
  if (error) {
    // You might want to redirect to login or show a global error page here
    // For now, we'll just pass null user and let UserProvider handle it
    console.error("Error fetching initial user in DashboardLayout:", error);
  }

  return (
    <UserProvider initialUser={initialUser}>
      <div className="bg-gray-100 text-gray-900">
        <DashboardNavbar />
        <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 mb-15" />
      </div>
      {children}
    </UserProvider>
  );
}
