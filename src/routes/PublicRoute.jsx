import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);
  const isAuthenticated = isLoggedIn || localStorage.getItem("user");

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
