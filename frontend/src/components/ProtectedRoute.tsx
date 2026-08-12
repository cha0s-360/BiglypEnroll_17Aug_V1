'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const denied = !!user && !!roles && !roles.includes((user as any).role);

  useEffect(() => {
    if (loading || user === null) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (denied) {
      const role = (user as any).role;
      const home = role === 'parent' ? '/app' : role === 'lender' ? '/credit' : '/dashboard';
      router.replace(home);
    }
  }, [user, loading, denied, router]);

  if (loading || user === null || !user || denied) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Box className="h-10 w-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </Box>
    );
  }
  return <>{children}</>;
}

export default ProtectedRoute;
