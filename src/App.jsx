import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicaments from "./pages/Medicaments";
import Stocks from "./pages/Stocks";
import Ventes from "./pages/Ventes";
import Clients from "./pages/Clients";
import Fournisseurs from "./pages/Fournisseurs";
import "./App.css";

function Layout({ children }) {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <main className="main-wrapper">{children}</main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/medicaments" element={<ProtectedRoute><Medicaments /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
            <Route path="/ventes" element={<ProtectedRoute><Ventes /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/fournisseurs" element={<ProtectedRoute><Fournisseurs /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
