import { useState, useEffect } from "react";
import API from "../services/api";

function Fournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: "", telephone: "", email: "", adresse: "" });

  const loadData = () => {
    API.get("/fournisseurs").then((res) => {
      setFournisseurs(res.data.fournisseurs);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ nom: "", telephone: "", email: "", adresse: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await API.put(`/fournisseurs/${editing}`, form);
    else await API.post("/fournisseurs", form);
    resetForm();
    loadData();
  };

  const handleEdit = (f) => {
    setForm({ nom: f.nom, telephone: f.telephone || "", email: f.email || "", adresse: f.adresse || "" });
    setEditing(f.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce fournisseur ?")) return;
    await API.delete(`/fournisseurs/${id}`);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Fournisseurs</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            <input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
          </div>
          <div className="form-row">
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">{editing ? "Modifier" : "Créer"}</button>
        </form>
      )}

      {loading ? (
        <p className="loading-msg">⏳ Chargement...</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>Nom</th><th>Téléphone</th><th>Email</th><th>Adresse</th><th>Actions</th></tr></thead>
          <tbody>
            {fournisseurs.map((f) => (
              <tr key={f.id}>
                <td>{f.nom}</td>
                <td>{f.telephone}</td>
                <td>{f.email || "-"}</td>
                <td>{f.adresse || "-"}</td>
                <td>
                  <button className="btn-small" onClick={() => handleEdit(f)}>✏️</button>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(f.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Fournisseurs;
