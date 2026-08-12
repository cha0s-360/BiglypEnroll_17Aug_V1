import { ProtectedRoute } from '@/components/ProtectedRoute';
import Students from '@/screens/admin/Students';
import { STAFF } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={STAFF}><Students /></ProtectedRoute>; }
