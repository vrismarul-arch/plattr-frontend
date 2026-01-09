import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";

// --- DIRECT IMPORTS ---
import AdminLayout from "../pages/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsAndConditions from "../pages/legal/TermsAndConditions";
import AdminLeads from "../pages/admin/AdminLeads";

// --- LAZY IMPORTS ---
const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/login/Login"));
const ProfilePage = React.lazy(() => import("../pages/login/ProfilePage"));
const Cart = React.lazy(() => import("../pages/product/Cart"));
const Product = React.lazy(() => import("../pages/product/Product"));
const Check = React.lazy(() => import("../pages/product/Check"));
const CheckoutSuccess = React.lazy(() => import("../pages/result/CheckoutSuccess"));
const CheckoutFailure = React.lazy(() => import("../pages/result/CheckoutFailure"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const BannerAdmin = React.lazy(() => import("../pages/admin/BannerAdmin"));
const AdminProfile = React.lazy(() => import("../pages/admin/AdminProfile"));
const AdminOrders = React.lazy(() => import("../pages/admin/AdminOrders"));
const MainDashboard = React.lazy(() => import("../pages/admin/MainDashboard"));

// Named export lazy load
const Booking = React.lazy(() =>
  import("../pages/booking/Booking").then((m) => ({
    default: m.Booking,
  }))
);

// --- ADMIN PROTECTION ---
const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

// --- ROUTER ---
const router = createBrowserRouter([
  {
    element: <ScrollToTop />, // ✅ SCROLL FIX
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/product/:id", element: <Product /> },
      { path: "/cart", element: <Cart /> },
      { path: "/bookings", element: <Booking /> },
      { path: "/checkout", element: <Check /> },
      { path: "/checkout-success", element: <CheckoutSuccess /> },
      { path: "/checkout-failure", element: <CheckoutFailure /> },
      { path: "/privacy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsAndConditions /> },

      // ADMIN
      { path: "/admin/login", element: <AdminLogin /> },
      {
        path: "/admin",
        element: (
          <AdminProtected>
            <AdminLayout />
          </AdminProtected>
        ),
        children: [
          { path: "dashboard", element: <MainDashboard /> },
          { path: "products", element: <AdminDashboard /> },
          { path: "banneradmin", element: <BannerAdmin /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "leads", element: <AdminLeads /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          Loading...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
