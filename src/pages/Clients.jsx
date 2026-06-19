import { useState, useEffect } from "react";
import API from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: "", telephone: "", email: "", adresse: "" });

  const loadData = () => {
    API.get("/clients").then((res) => {
      setClients(res.data.clients);
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
    if (editing) await API.put(`/clients/${editing}`, form);
    else await API.post("/clients", form);
    resetForm();
    loadData();
  };

  const handleEdit = (c) => {
    setForm({ nom: c.nom, telephone: c.telephone || "", email: c.email || "", adresse: c.adresse || "" });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce client ?")) return;
    await API.delete(`/clients/${id}`);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Clients</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            <input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
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
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.nom}</td>
                <td>{c.telephone || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>{c.adresse || "-"}</td>
                <td>
                  <button className="btn-small" onClick={() => handleEdit(c)}>✏️</button>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(c.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Clients;
