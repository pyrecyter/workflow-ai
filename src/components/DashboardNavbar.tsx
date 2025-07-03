
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { logout } from '@/app/(dashboard)/dashboard/actions';
import { usePathname } from 'next/navigation';

export default function DashboardNavbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const navLinkClasses = (path: string) => (
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === path ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`
  );

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="text-2xl font-extrabold text-blue-600">
          Events-SL
        </Link>
        <Link href="/create-event" className={navLinkClasses('/create-event')}>
          Create Event
        </Link>
        <Link href="/my-events" className={navLinkClasses('/my-events')}>
          My Events
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleProfileMenu}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Profile menu"
        >
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
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
            </Link>
              <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
          </div>
        )}
      </div>
    </nav>
  );
}
