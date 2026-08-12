import { ProtectedRoute } from '@/components/ProtectedRoute';
import CreditDashboard from '@/screens/credit/CreditDashboard';
import { CREDIT_VIEW } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={CREDIT_VIEW}><CreditDashboard /></ProtectedRoute>; }
