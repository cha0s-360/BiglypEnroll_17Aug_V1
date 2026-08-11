import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

import Landing from "@/pages/Landing";
import BiglypMaster from "@/pages/BiglypMaster";
import CareerHub from "@/pages/CareerHub";
import BiglypEnroll from "@/pages/BiglypEnroll";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import FeeStructure from "@/pages/admin/FeeStructure";
import Students from "@/pages/admin/Students";
import Team from "@/pages/admin/Team";
import Onboarding from "@/pages/admin/Onboarding";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import PaymentHistory from "@/pages/parent/PaymentHistory";
import MandateSetup from "@/pages/parent/MandateSetup";
import ActiveFinancing from "@/pages/parent/ActiveFinancing";
import Rewards from "@/pages/parent/Rewards";
import Reminders from "@/pages/admin/Reminders";
import CreditDashboard from "@/pages/credit/CreditDashboard";
import Applications from "@/pages/credit/Applications";
import NewApplication from "@/pages/credit/NewApplication";
import ApplicationDetail from "@/pages/credit/ApplicationDetail";
import Policies from "@/pages/credit/Policies";

const STAFF = ["super_admin", "school_admin", "finance", "counsellor", "manager", "admission", "legal", "credit_ops"];
const CREDIT_STAFF = ["super_admin", "credit_ops", "school_admin", "finance", "manager", "counsellor"];
const CREDIT_VIEW = [...CREDIT_STAFF, "lender"];

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/biglypenroll" element={<BiglypMaster />} />
            <Route path="/career-hub" element={<CareerHub />} />
            <Route path="/fee-collection" element={<BiglypEnroll />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Staff dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute roles={STAFF}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/fees" element={<ProtectedRoute roles={STAFF}><FeeStructure /></ProtectedRoute>} />
            <Route path="/dashboard/students" element={<ProtectedRoute roles={STAFF}><Students /></ProtectedRoute>} />
            <Route path="/dashboard/team" element={<ProtectedRoute roles={["super_admin", "school_admin", "manager"]}><Team /></ProtectedRoute>} />
            <Route path="/dashboard/onboarding" element={<ProtectedRoute roles={["super_admin", "school_admin"]}><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard/reminders" element={<ProtectedRoute roles={STAFF}><Reminders /></ProtectedRoute>} />

            {/* Parent app */}
            <Route path="/app" element={<ProtectedRoute roles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
            <Route path="/app/mandate" element={<ProtectedRoute roles={["parent"]}><MandateSetup /></ProtectedRoute>} />
            <Route path="/app/history" element={<ProtectedRoute roles={["parent"]}><PaymentHistory /></ProtectedRoute>} />
            <Route path="/app/financing" element={<ProtectedRoute roles={["parent"]}><ActiveFinancing /></ProtectedRoute>} />
            <Route path="/app/rewards" element={<ProtectedRoute roles={["parent"]}><Rewards /></ProtectedRoute>} />

            {/* Credit / Loan Origination */}
            <Route path="/credit" element={<ProtectedRoute roles={CREDIT_VIEW}><CreditDashboard /></ProtectedRoute>} />
            <Route path="/credit/applications" element={<ProtectedRoute roles={CREDIT_VIEW}><Applications /></ProtectedRoute>} />
            <Route path="/credit/new" element={<ProtectedRoute roles={CREDIT_STAFF}><NewApplication /></ProtectedRoute>} />
            <Route path="/credit/app/:id" element={<ProtectedRoute roles={CREDIT_VIEW}><ApplicationDetail /></ProtectedRoute>} />
            <Route path="/credit/policies" element={<ProtectedRoute roles={["super_admin", "credit_ops"]}><Policies /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;
