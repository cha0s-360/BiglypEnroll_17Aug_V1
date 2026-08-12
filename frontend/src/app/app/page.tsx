import { ProtectedRoute } from '@/components/ProtectedRoute';
import ParentDashboard from '@/screens/parent/ParentDashboard';
import { PARENT } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={PARENT}><ParentDashboard /></ProtectedRoute>; }
