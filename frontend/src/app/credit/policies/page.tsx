import { ProtectedRoute } from '@/components/ProtectedRoute';
import Policies from '@/screens/credit/Policies';
import { POLICY_ROLES } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={POLICY_ROLES}><Policies /></ProtectedRoute>; }
