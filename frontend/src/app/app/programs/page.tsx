import ProtectedRoute from '@/components/ProtectedRoute';
import { PARENT } from '@/lib/roles';
import ProgramDiscovery from '@/screens/parent/ProgramDiscovery';
export default function Page() { return <ProtectedRoute roles={PARENT}><ProgramDiscovery /></ProtectedRoute>; }
