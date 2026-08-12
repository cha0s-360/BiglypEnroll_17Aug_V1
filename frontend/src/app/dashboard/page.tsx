import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminDashboard from '@/screens/admin/AdminDashboard';
import { STAFF } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={STAFF}><AdminDashboard /></ProtectedRoute>; }
