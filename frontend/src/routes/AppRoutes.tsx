// frontend/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
// import RegisterPage from "../pages/Registe";
import ListingPage from "../pages/Listing";
import ListingDetailPage from "../pages/ListingDetail";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AddListingPage from "../pages/AddListing";
import DashboardPage from "../pages/Dashboard/Home";

export default function AppRoutes() {
  return (
    <Routes>
    <Route path="/" element={<HomePage />} />
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/listings" element={<ListingPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/listing/new" element={<AddListingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/listings" replace />} />
    </Routes>
  );
}
