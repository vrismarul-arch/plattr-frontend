import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React, { Suspense } from 'react'; // <-- REQUIRED IMPORTS

// --- Directly Imported Layouts & Wrappers ---
// Keep these direct imports if they are needed immediately (e.g., for routing logic)
import AdminLayout from "../pages/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsAndConditions from "../pages/legal/TermsAndConditions";
import AdminLeads from "../pages/admin/AdminLeads";


// --- LAZY LOADED ROUTE COMPONENTS ---
// Using React.lazy() for all components used as 'element' in the routes
const Home = React.lazy(() => import("../pages/Home"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const BannerAdmin = React.lazy(() => import("../pages/admin/BannerAdmin"));
const AdminProfile = React.lazy(() => import("../pages/admin/AdminProfile"));
const Cart = React.lazy(() => import("../pages/product/Cart"));
const Login = React.lazy(() => import("../pages/login/Login"));
const Check = React.lazy(() => import("../pages/product/Check"));

// IMPORTANT: Assuming 'Booking' is a NAMED export in its file, 
// this is the corrected way to lazy-load it:
const Booking = React.lazy(() => 
    import("../pages/booking/Booking").then(module => ({ default: module.Booking }))
);

const ProfilePage = React.lazy(() => import("../pages/login/ProfilePage"));
const MainDashboard = React.lazy(() => import("../pages/admin/MainDashboard"));
const AdminOrders = React.lazy(() => import("../pages/admin/AdminOrders"));
const CheckoutFailure = React.lazy(() => import("../pages/result/CheckoutFailure"));
const CheckoutSuccess = React.lazy(() => import("../pages/result/CheckoutSuccess"));
// (Note: OrderStatus is commented out in your original code, so it's omitted here)


// Protected wrapper for admin routes (Unchanged)
const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

// --- ROUTER DEFINITION ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Lazy loaded
  },
  {
    path: "/login",
    element: <Login />, // Lazy loaded
  },
  {
    path: "/profile",
    element: <ProfilePage />, // Lazy loaded
  },
  {
    path: "/admin/login",
    element: <AdminLogin />, // Directly imported
  },
  {
    path: "/admin",
    element: (
      <AdminProtected>
        <AdminLayout /> 
      </AdminProtected>
    ),
    children: [
      { path: "dashboard", element: <MainDashboard /> }, // Lazy loaded
      { path: "products", element: <AdminDashboard /> }, // Lazy loaded
      { path: "banneradmin", element: <BannerAdmin /> }, // Lazy loaded
      { path: "profile", element: <AdminProfile /> }, // Lazy loaded
      { path: "orders", element: <AdminOrders /> }, // Lazy loaded
      { path: "leads", element: <AdminLeads /> }, // Lazy loaded
    ],
  },
  {
    path: "/cart",
    element: <Cart />, // Lazy loaded
  },
  {
    path: "/bookings",
    element: <Booking />, // Lazy loaded
  },
  {
    path: "/checkout",
    element: <Check />, // Lazy loaded
  },
  {
    path: "/checkout-success",
    element: <CheckoutSuccess />, // Lazy loaded
  },
  {
    path: "/checkout-failure",
    element: <CheckoutFailure />, // Lazy loaded
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />, // Lazy loaded
  },
  {
    path: "/terms",
    element: <TermsAndConditions />, // Lazy loaded
  },
]);


// --- APPLICATION ENTRY POINT ---
export default function AppRouter() {
  return (
    // The Suspense boundary applies the loading state globally
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        fontSize: '24px', 
        color: '#007bff' 
      }}>
        {/* You can replace this with a nice CSS spinner or component */}
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  );
}