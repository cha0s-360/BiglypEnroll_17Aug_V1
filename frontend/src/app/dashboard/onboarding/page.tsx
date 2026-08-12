import { ProtectedRoute } from '@/components/ProtectedRoute';
import Onboarding from '@/screens/admin/Onboarding';
import { ADMIN_ONLY } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={ADMIN_ONLY}><Onboarding /></ProtectedRoute>; }
