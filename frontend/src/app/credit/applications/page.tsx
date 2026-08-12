import { ProtectedRoute } from '@/components/ProtectedRoute';
import Applications from '@/screens/credit/Applications';
import { CREDIT_VIEW } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={CREDIT_VIEW}><Applications /></ProtectedRoute>; }
