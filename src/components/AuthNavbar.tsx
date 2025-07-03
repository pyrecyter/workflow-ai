
'use client';

import Link from 'next/link';

export default function AuthNavbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-extrabold text-blue-600">
        Events-SL
      </Link>
      <div>
        <Link href="/login" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Login
        </Link>
      </div>
    </nav>
  );
}
