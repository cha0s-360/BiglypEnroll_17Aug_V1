import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PARENT } from '@/lib/roles';
import PsychometryReports from '@/screens/parent/PsychometryReports';
export default function Page() {
  return (
    <ProtectedRoute roles={PARENT}>
      <Suspense fallback={null}>
        <PsychometryReports />
      </Suspense>
    </ProtectedRoute>
  );
}
