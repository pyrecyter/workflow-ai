
'use client';

import { useState, useEffect } from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Snackbar({ message, type, onClose }: SnackbarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Snackbar disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg text-white ${bgColor} transition-opacity duration-300`}
    >
      {message}
    </div>
  );
}
