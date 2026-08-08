import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import FeeStructure from "@/pages/admin/FeeStructure";
import Students from "@/pages/admin/Students";
import Team from "@/pages/admin/Team";
import Onboarding from "@/pages/admin/Onboarding";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import PaymentHistory from "@/pages/parent/PaymentHistory";

const STAFF = ["super_admin", "school_admin", "finance", "counsellor", "manager", "admission", "legal"];

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Staff dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute roles={STAFF}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/fees" element={<ProtectedRoute roles={STAFF}><FeeStructure /></ProtectedRoute>} />
            <Route path="/dashboard/students" element={<ProtectedRoute roles={STAFF}><Students /></ProtectedRoute>} />
            <Route path="/dashboard/team" element={<ProtectedRoute roles={["super_admin", "school_admin", "manager"]}><Team /></ProtectedRoute>} />
            <Route path="/dashboard/onboarding" element={<ProtectedRoute roles={["super_admin", "school_admin"]}><Onboarding /></ProtectedRoute>} />

            {/* Parent app */}
            <Route path="/app" element={<ProtectedRoute roles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
            <Route path="/app/history" element={<ProtectedRoute roles={["parent"]}><PaymentHistory /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;
