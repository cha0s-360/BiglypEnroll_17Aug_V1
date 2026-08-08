import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const home = user.role === "parent" ? "/app" : user.role === "lender" ? "/credit" : "/dashboard";
    return <Navigate to={home} replace />;
  }
  return children;
}
