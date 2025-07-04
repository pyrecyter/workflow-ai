'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}