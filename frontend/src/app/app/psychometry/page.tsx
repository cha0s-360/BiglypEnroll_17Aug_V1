import ProtectedRoute from '@/components/ProtectedRoute';
import { PARENT } from '@/lib/roles';
import PsychometryAssessment from '@/screens/parent/PsychometryAssessment';
export default function Page() { return <ProtectedRoute roles={PARENT}><PsychometryAssessment /></ProtectedRoute>; }
