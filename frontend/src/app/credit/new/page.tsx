import { ProtectedRoute } from '@/components/ProtectedRoute';
import NewApplication from '@/screens/credit/NewApplication';
import { CREDIT_STAFF } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={CREDIT_STAFF}><NewApplication /></ProtectedRoute>; }
