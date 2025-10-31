// frontend/src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  // If token exists, redirect to listings
  if (token && user.role === "admin")
    return <Navigate to='/listings' replace />;

  if (token && user.role === "superAdmin") {
    return <Navigate to='/dashboard' replace />;
  }

  // Otherwise show nested routes (login/register)
  return <Outlet />;
}
