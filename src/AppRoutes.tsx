import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Magazzino from "./pages/Magazzino";
import Vetrina from "./pages/Vetrina";

const AppRoutes = ({ user, role, logout }: { user: any; role: string | null; logout: () => void }) => {
  return (
    <Routes>
      {!user && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {user && role === "gestore" && (
        <>
          <Route path="/magazzino" element={<Magazzino logout={logout} />} />
          <Route path="*" element={<Navigate to="/magazzino" />} />
        </>
      )}

      {user && role !== "gestore" && (
        <>
          <Route path="/vetrina" element={<Vetrina logout={logout} />} />
          <Route path="*" element={<Navigate to="/vetrina" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
