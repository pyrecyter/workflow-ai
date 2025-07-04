
'use client';

import { useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  duration?: number; // Optional duration prop
  onClose: () => void;
}

export default function Snackbar({ message, type, duration = 3000, onClose }: SnackbarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the snackbar after component mounts
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false); // Start fade out
      // Call onClose after fade out completes (duration + transition time)
      setTimeout(() => onClose(), 300); // Assuming 300ms for transition-opacity
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg text-white ${bgColor} transition-opacity duration-300 ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ zIndex: 9999 }} // Ensure it's always on top
    >
      {message}
    </div>
  );
}
