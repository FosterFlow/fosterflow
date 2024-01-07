import React from "react";
import { Navigate } from "react-router-dom";

// lazy load all the views
const Chats = React.lazy(() => import("../pages/dashboard/Tabs/Chats"));
const Agents = React.lazy(() => import("../pages/dashboard/Tabs/Agents"));
const Profile = React.lazy(() => import("../pages/dashboard/Tabs/Profile"));
const Settings = React.lazy(() => import("../pages/dashboard/Tabs/Settings"));

// auth
const Login = React.lazy(() => import("../pages/Auth/Login"));
const Logout = React.lazy(() => import("../pages/Auth/Logout"));
const ForgetPassword = React.lazy(() => import("../pages/Auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/Auth/Register"));
const PasswordReset = React.lazy(() => import("../pages/Auth/PasswordReset"));

// declare all routes
const authProtectedRoutes = [
  { path: "/chats", component: <Chats /> },
  { path: "/chats/:id", component: <Chats /> },
  ///chats/new_chat url requires for mobile devices
  { path: "/chats/new_chat", component: <Chats /> },
  { path: "/chats/new_chat/:agentId", component: <Chats /> },
  { path: "/agents", component: <Agents /> },
  { path: "/agents/:id", component: <Agents /> },
  { path: "/chats/email-verify-token/:emailVerifyToken", component: <Chats /> },
  { path: "/profile", component: <Profile /> },
  { path: "/settings", component: <Settings /> },
  { path: "/logout", component: <Logout /> },
];

const publicRoutes = [
  { path: "/password-reset/:passwordResetToken", component: <PasswordReset/> },
  { path: "/forget-password", component: <ForgetPassword /> },
];

const authRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/login/email-verify-token/:emailVerifyToken", component: <Login /> },
  { path: "/register", component: <Register /> },
  //TODO: add 404 page
];

export { authProtectedRoutes, authRoutes, publicRoutes };
