'use client';

import ProfileForm from '@/components/ProfileForm';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const { user, loading, error, refetchUser } = useUser();

  if (loading) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto text-center">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto text-center text-gray-600">
        User data not available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Profile</h2>
      <ProfileForm user={user} refetchUser={refetchUser} />
    </div>
  );
}