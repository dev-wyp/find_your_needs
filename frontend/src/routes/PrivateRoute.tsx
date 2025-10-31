// frontend/src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../shared/hooks";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) return <Navigate to='/' replace />;

  // If token exists, render nested routes
  return <Outlet />;
}
