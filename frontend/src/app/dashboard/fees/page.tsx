import { ProtectedRoute } from '@/components/ProtectedRoute';
import FeeStructure from '@/screens/admin/FeeStructure';
import { STAFF } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={STAFF}><FeeStructure /></ProtectedRoute>; }
