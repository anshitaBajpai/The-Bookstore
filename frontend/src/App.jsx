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
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        <Route element={<PrivateRoute adminOnly={true} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
