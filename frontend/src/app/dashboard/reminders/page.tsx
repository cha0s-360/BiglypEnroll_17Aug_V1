import { ProtectedRoute } from '@/components/ProtectedRoute';
import Reminders from '@/screens/admin/Reminders';
import { STAFF } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={STAFF}><Reminders /></ProtectedRoute>; }
