import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
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
    </Routes>
  );
};

export default App;
