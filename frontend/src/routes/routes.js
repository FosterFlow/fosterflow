import React from "react";
import { Navigate } from "react-router-dom";

// lazy load all the views
const Chats = React.lazy(() => import("../pages/dashboard/Tabs/Chats"));
const Profile = React.lazy(() => import("../pages/dashboard/Tabs/Profile"));
const Settings = React.lazy(() => import("../pages/dashboard/Tabs/Settings"));

// auth
const Login = React.lazy(() => import("../pages/Auth/Login"));
const Logout = React.lazy(() => import("../pages/Auth/Logout"));
const ForgetPassword = React.lazy(() => import("../pages/Auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/Auth/Register"));
const EmailVerification = React.lazy(() => import("../pages/Auth/EmailVerification"));
const PasswordReset = React.lazy(() => import("../pages/Auth/PasswordReset"));

// declare all routes
const authProtectedRoutes = [
  { path: "/chats/", component: <Chats /> },
  { path: "/chats/:id", component: <Chats /> },
  { path: "/profile", component: <Profile /> },
  { path: "/settings", component: <Settings /> },
  { path: "/logout", component: <Logout /> },

    // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/chats" />,
  },
];

const publicRoutes = [
  { path: "/email-verify/:token", component: <EmailVerification/> },
  { path: "/password-reset/:token", component: <PasswordReset/> },
  { path: "/forget-password", component: <ForgetPassword /> },
];

const authRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, authRoutes, publicRoutes };
