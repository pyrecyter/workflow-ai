
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { logout } from '@/app/(dashboard)/dashboard/actions';
import { usePathname } from 'next/navigation';
import CreateEventModal from './CreateEventModal';
import { useUser } from '@/hooks/useUser';

export default function DashboardNavbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading } = useUser();
  const pathname = usePathname();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const navLinkClasses = (path: string) => (
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === path ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userInitials = user && user.firstName && user.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : user && user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user && user.email
    ? user.email.charAt(0).toUpperCase()
    : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center h-16">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="text-2xl font-extrabold text-blue-600">
          Events-SL
        </Link>
        {!isMobile && (
          <>
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Create Event
            </button>
            <Link href="/my-events" className={navLinkClasses('/my-events')}>
              My Events
            </Link>
          </>
        )}
      </div>

      <div className="relative">
        <button
          onClick={toggleProfileMenu}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Profile menu"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          ) : userInitials ? (
            <span className="text-lg font-semibold">{userInitials}</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            {isMobile && (
              <>
                <button
                  onClick={() => {
                    setIsCreateEventModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Create Event
                </button>
                <Link
                  href="/my-events"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  My Events
                </Link>
              </>
            )}
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
      {isCreateEventModalOpen && (
        <CreateEventModal onClose={() => setIsCreateEventModalOpen(false)} />
      )}
    </nav>
  );
}
