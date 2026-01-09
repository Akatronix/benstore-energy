import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export function PublicRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const { exp } = decoded;

      // Check token validity
      const currentTime = Date.now() / 1000;
      if (exp > currentTime) {
        toast.info("You are already logged in.");
        return <Navigate to={`/dashboard`} replace />;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // No valid token → allow access to login/signup
  return <Outlet />;
}
