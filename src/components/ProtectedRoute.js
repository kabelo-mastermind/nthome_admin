import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    // not logged in
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
