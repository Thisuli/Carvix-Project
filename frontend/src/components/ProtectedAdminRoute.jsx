import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const token =
    localStorage.getItem("carvixAdminToken") ||
    sessionStorage.getItem("carvixAdminToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;