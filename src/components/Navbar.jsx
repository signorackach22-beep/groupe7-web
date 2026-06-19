import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">💊 PharmaCare</div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/medicaments">Médicaments</Link>
        <Link to="/stocks">Stocks</Link>
        <Link to="/ventes">Ventes</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/fournisseurs">Fournisseurs</Link>
      </div>
      <div className="navbar-user">
        <span>👤 {user?.nom}</span>
        <span className="role-badge">{user?.role}</span>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </nav>
  );
}

export default Navbar;
