
'use client';

import { useContext } from 'react';
import { SnackbarContext } from '@/context/SnackbarContext';

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
