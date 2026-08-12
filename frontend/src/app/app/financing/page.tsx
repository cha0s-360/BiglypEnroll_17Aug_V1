import { ProtectedRoute } from '@/components/ProtectedRoute';
import ActiveFinancing from '@/screens/parent/ActiveFinancing';
import { PARENT } from '@/lib/roles';
export default function Page() { return <ProtectedRoute roles={PARENT}><ActiveFinancing /></ProtectedRoute>; }
