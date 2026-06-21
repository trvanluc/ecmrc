'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    hydrated,
  } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (
      hydrated &&
      !isAuthenticated
    ) {
      router.push('/login');
    }
  }, [
    hydrated,
    isAuthenticated,
    router,
  ]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}