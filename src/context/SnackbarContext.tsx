
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@/components/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, type: 'success' | 'error', duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbarState, setSnackbarState] = useState<{ message: string; type: 'success' | 'error'; duration?: number; key: number } | null>(null);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error', duration?: number) => {
    setSnackbarState({ message, type, duration, key: Date.now() });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarState(null);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbarState && (
        <Snackbar
          key={snackbarState.key}
          message={snackbarState.message}
          type={snackbarState.type}
          duration={snackbarState.duration}
          onClose={handleCloseSnackbar}
        />
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
