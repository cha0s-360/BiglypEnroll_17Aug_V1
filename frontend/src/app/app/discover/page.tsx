import ProtectedRoute from '@/components/ProtectedRoute';
import { PARENT } from '@/lib/roles';
import StudentDashboard from '@/screens/parent/StudentDashboard';
export default function Page() { return <ProtectedRoute roles={PARENT}><StudentDashboard /></ProtectedRoute>; }
