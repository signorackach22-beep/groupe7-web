import { useState, useEffect } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alertes, setAlertes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get("/dashboard"), API.get("/medicaments/alertes")])
      .then(([dashRes, alertRes]) => {
        setStats(dashRes.data);
        setAlertes(alertRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-msg">⏳ Chargement...</p>;

  return (
    <div className="page">
      <h1>Tableau de bord</h1>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <span className="stat-icon">💊</span>
          <div>
            <p className="stat-value">{stats?.totalMedicaments ?? 0}</p>
            <p className="stat-label">Médicaments</p>
          </div>
        </div>
        <div className="stat-card stat-green">
          <span className="stat-icon">🛒</span>
          <div>
            <p className="stat-value">{stats?.totalVentes ?? 0}</p>
            <p className="stat-label">Ventes</p>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <span className="stat-icon">👥</span>
          <div>
            <p className="stat-value">{stats?.totalClients ?? 0}</p>
            <p className="stat-label">Clients</p>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-value">{(stats?.chiffreAffaires ?? 0).toFixed(0)} FCFA</p>
            <p className="stat-label">Chiffre d'affaires</p>
          </div>
        </div>
      </div>

      <div className="alerts-section">
        <h2>⚠️ Alertes</h2>
        <div className="alerts-grid">
          <div className="alert-box alert-warning">
            <strong>{alertes?.stockFaible?.length ?? 0}</strong> médicament(s) en stock faible
          </div>
          <div className="alert-box alert-danger">
            <strong>{alertes?.rupture?.length ?? 0}</strong> médicament(s) en rupture
          </div>
          <div className="alert-box alert-danger">
            <strong>{alertes?.expires?.length ?? 0}</strong> médicament(s) expiré(s)
          </div>
          <div className="alert-box alert-warning">
            <strong>{alertes?.bientotExpires?.length ?? 0}</strong> proche(s) d'expiration
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
