import ProtectedRoute from '@/components/ProtectedRoute';
import { PARENT } from '@/lib/roles';
import AssessmentAttempt from '@/screens/parent/AssessmentAttempt';
export default function Page() { return <ProtectedRoute roles={PARENT}><AssessmentAttempt /></ProtectedRoute>; }
