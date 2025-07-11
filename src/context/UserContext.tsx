
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { fetchUserProfile } from '@/app/api/profile/actions';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: React.ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  const fetchAndSetUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { user: fetchedUser, error: fetchError } = await fetchUserProfile();
    if (fetchedUser) {
      setUser(fetchedUser);
    } else {
      setError(fetchError);
      showSnackbar(fetchError || 'Failed to fetch user profile', 'error');
      setUser(null);
    }
    setLoading(false);
  }, [showSnackbar]);

  const refetchUser = useCallback(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  useEffect(() => {
    if (!initialUser && !user && !loading) {
      fetchAndSetUser();
    }
  }, [initialUser, user, loading, fetchAndSetUser]);

  return (
    <UserContext.Provider value={{ user, loading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
