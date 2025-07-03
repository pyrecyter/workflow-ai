'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Snackbar from '@/components/Snackbar';
import Link from 'next/link';
import { register } from '@/app/register/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? 'Registering...' : 'Register'}
    </button>
  );
}

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const initialFirstName = searchParams.get('firstName') || '';
  const initialLastName = searchParams.get('lastName') || '';
  const initialEmail = searchParams.get('email') || '';
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
      <form action={register} className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            defaultValue={initialFirstName}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            defaultValue={initialLastName}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={initialEmail}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        <SubmitButton />
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account? {' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Login here
        </Link>
      </p>
      {showSnackbar && (
        <Snackbar message={error as string} type="error" onClose={handleCloseSnackbar} />
      )}
    </div>
  );
}