import { ProtectedRoute } from '@/components/ProtectedRoute';
import PaymentHistory from '@/screens/parent/PaymentHistory';
import { PARENT } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={PARENT}><PaymentHistory /></ProtectedRoute>; }
