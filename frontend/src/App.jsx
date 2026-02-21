import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookDetails from "./pages/BookDetails";
import AuthHeader from "./components/AuthHeader";
import Wishlist from "./pages/Wishlist";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/auth"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {shouldHideFooter ? <AuthHeader /> : <Navbar />}
      <Routes>
        {/* Home and Cart are protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* Auth page is public */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin page protected for admin only */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
