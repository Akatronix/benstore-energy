import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If no token, redirect immediately
  if (!token) {
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if token has required fields
    if (!decoded?.exp) {
      toast.error("Invalid authentication token.");
      return <Navigate to="/login" replace />;
    }

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.");
      return <Navigate to="/login" replace />;
    }

    // Everything valid, allow access
    return <Outlet />;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Authentication failed. Please log in again.");
    return <Navigate to="/login" replace />;
  }
}
