import { ProtectedRoute } from '@/components/ProtectedRoute';
import Team from '@/screens/admin/Team';
import { TEAM_ROLES } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={TEAM_ROLES}><Team /></ProtectedRoute>; }
