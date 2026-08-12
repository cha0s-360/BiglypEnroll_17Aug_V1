import { ProtectedRoute } from '@/components/ProtectedRoute';
import Rewards from '@/screens/parent/Rewards';
import { PARENT } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={PARENT}><Rewards /></ProtectedRoute>; }
