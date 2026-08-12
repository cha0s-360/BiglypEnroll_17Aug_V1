import { ProtectedRoute } from '@/components/ProtectedRoute';
import MandateSetup from '@/screens/parent/MandateSetup';
import { PARENT } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={PARENT}><MandateSetup /></ProtectedRoute>; }
