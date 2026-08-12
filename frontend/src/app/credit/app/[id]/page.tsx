import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApplicationDetail from '@/screens/credit/ApplicationDetail';
import { CREDIT_VIEW } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={CREDIT_VIEW}><ApplicationDetail /></ProtectedRoute>; }
