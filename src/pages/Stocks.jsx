import { useState, useEffect } from "react";
import API from "../services/api";

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ medicamentId: "", type: "ENTREE", quantite: "", motif: "" });

  const loadData = () => {
    Promise.all([API.get("/stocks"), API.get("/medicaments")]).then(([s, m]) => {
      setStocks(s.data.stocks);
      setMedicaments(m.data.medicaments);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/stocks/mouvement", form);
      setForm({ medicamentId: "", type: "ENTREE", quantite: "", motif: "" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  const typeLabel = { ENTREE: "🟢 Entrée", SORTIE: "🔴 Sortie", AJUSTEMENT: "🟡 Ajustement" };

  return (
    <div className="page">
      <h1>Gestion du stock</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Nouveau mouvement</h3>
        <div className="form-row">
          <select value={form.medicamentId} onChange={(e) => setForm({ ...form, medicamentId: e.target.value })} required>
            <option value="">-- Choisir un médicament --</option>
            {medicaments.map((m) => (
              <option key={m.id} value={m.id}>{m.nom} (stock: {m.quantite})</option>
            ))}
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="ENTREE">Entrée</option>
            <option value="SORTIE">Sortie</option>
            <option value="AJUSTEMENT">Ajustement</option>
          </select>
        </div>
        <div className="form-row">
          <input type="number" placeholder="Quantité" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} required />
          <input placeholder="Motif (optionnel)" value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </form>

      <h2>Historique des mouvements</h2>
      {loading ? (
        <p className="loading-msg">⏳ Chargement...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Médicament</th><th>Type</th><th>Quantité</th><th>Motif</th><th>Date</th></tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id}>
                <td>{s.medicament.nom}</td>
                <td>{typeLabel[s.type]}</td>
                <td>{s.quantite}</td>
                <td>{s.motif || "-"}</td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Stocks;
