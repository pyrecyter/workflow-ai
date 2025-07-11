import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import AuthNavbar from "@/components/AuthNavbar";
import { SnackbarProvider } from "@/context/SnackbarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Events SL",
  description: "Your go-to platform for events in Sri Lanka",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider>
          <main className="bg-gray-100 text-gray-900 mt-[var(--navbar-height)] min-h-screen flex-grow">
            {!isAuthenticated && (
              <>
                <AuthNavbar />
                <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 mb-15" />
              </>
            )}
            {children}
          </main>
        </SnackbarProvider>
      </body>
    </html>
  );
}
