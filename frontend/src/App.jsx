import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookDetails from "./pages/BookDetails";
import AuthHeader from "./components/AuthHeader";
import Wishlist from "./pages/Wishlist";
import ErrorPage from "./pages/ErrorPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/auth", "/forgot-password"];
  const shouldHideFooter =
    hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {shouldHideFooter ? <AuthHeader /> : <Navbar />}
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<PrivateRoute adminOnly={true} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
