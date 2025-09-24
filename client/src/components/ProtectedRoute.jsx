import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles = [], requireOwnership = false, resourceId = null }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push("/login");
        return;
      }

      // Role-based access control
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
        return;
      }

      // Ownership check (for regular users accessing their own resources)
      if (requireOwnership && user.role === "user" && resourceId && user.id !== resourceId) {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, router, allowedRoles, requireOwnership, resourceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null; // Will redirect to dashboard
  }

  return children;
};

export default ProtectedRoute;