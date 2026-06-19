import { useState, useEffect } from "react";
import API from "../services/api";

function Ventes() {
  const [ventes, setVentes] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([{ medicamentId: "", quantite: 1 }]);

  const loadData = () => {
    Promise.all([API.get("/ventes"), API.get("/medicaments"), API.get("/clients")]).then(([v, m, c]) => {
      setVentes(v.data.ventes);
      setMedicaments(m.data.medicaments);
      setClients(c.data.clients);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const addItem = () => setItems([...items, { medicamentId: "", quantite: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const newItems = [...items];
    newItems[i][field] = value;
    setItems(newItems);
  };

  const calculTotal = () => {
    return items.reduce((sum, item) => {
      const med = medicaments.find((m) => m.id === Number(item.medicamentId));
      return sum + (med ? med.prixVente * item.quantite : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/ventes", {
        clientId: clientId || null,
        items: items.map((i) => ({ medicamentId: Number(i.medicamentId), quantite: Number(i.quantite) })),
      });
      setItems([{ medicamentId: "", quantite: 1 }]);
      setClientId("");
      setShowForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Ventes</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Nouvelle vente"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Client anonyme</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>

          {items.map((item, i) => (
            <div className="form-row" key={i}>
              <select value={item.medicamentId} onChange={(e) => updateItem(i, "medicamentId", e.target.value)} required>
                <option value="">-- Médicament --</option>
                {medicaments.map((m) => (
                  <option key={m.id} value={m.id}>{m.nom} ({m.prixVente} FCFA)</option>
                ))}
              </select>
              <input type="number" min="1" value={item.quantite} onChange={(e) => updateItem(i, "quantite", e.target.value)} required />
              {items.length > 1 && <button type="button" className="btn-small btn-danger" onClick={() => removeItem(i)}>✕</button>}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addItem}>+ Ajouter un produit</button>
          <p className="total-display">Total : <strong>{calculTotal().toFixed(0)} FCFA</strong></p>
          <button type="submit" className="btn-primary">Valider la vente</button>
        </form>
      )}

      {loading ? (
        <p className="loading-msg">⏳ Chargement...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>N°</th><th>Client</th><th>Vendeur</th><th>Montant</th><th>Date</th></tr>
          </thead>
          <tbody>
            {ventes.map((v) => (
              <tr key={v.id}>
                <td>#{v.id}</td>
                <td>{v.client?.nom || "Anonyme"}</td>
                <td>{v.user.nom}</td>
                <td>{v.montant.toFixed(0)} FCFA</td>
                <td>{new Date(v.dateVente).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ventes;
