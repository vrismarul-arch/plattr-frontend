import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import BannerAdmin from "../pages/admin/BannerAdmin";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminProfile from "../pages/admin/AdminProfile";
import Cart from "../pages/product/Cart";
import Login from "../pages/login/Login";
// import AdminOrders from "../pages/admin/AdminOrders";
import Check from "../pages/product/Check";
import { Booking } from "../pages/booking/Booking";
import ProfilePage from "../pages/login/ProfilePage";
import MainDashboard from "../pages/admin/MainDashboard";
import AdminOrders from "../pages/admin/AdminOrders";

// Protected wrapper for admin routes
const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
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
    ],
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/bookings",
    element: <Booking />,
  },
  {
    path: "/checkout",
    element: <Check />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
