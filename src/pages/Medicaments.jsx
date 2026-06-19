import { useState, useEffect } from "react";
import API from "../services/api";

function Medicaments() {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "", categorie: "", description: "", prixAchat: "", prixVente: "",
    quantite: "", dateExpiration: "", fabricant: "",
  });

  const loadData = () => {
    API.get("/medicaments").then((res) => {
      setMedicaments(res.data.medicaments);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ nom: "", categorie: "", description: "", prixAchat: "", prixVente: "", quantite: "", dateExpiration: "", fabricant: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/medicaments/${editing}`, form);
      } else {
        await API.post("/medicaments", form);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  const handleEdit = (med) => {
    setForm({
      nom: med.nom, categorie: med.categorie, description: med.description || "",
      prixAchat: med.prixAchat, prixVente: med.prixVente, quantite: med.quantite,
      dateExpiration: med.dateExpiration.split("T")[0], fabricant: med.fabricant || "",
    });
    setEditing(med.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce médicament ?")) return;
    await API.delete(`/medicaments/${id}`);
    loadData();
  };

  const filtered = medicaments.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Médicaments</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            <input placeholder="Catégorie" value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} required />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="form-row">
            <input type="number" placeholder="Prix achat" value={form.prixAchat} onChange={(e) => setForm({ ...form, prixAchat: e.target.value })} required />
            <input type="number" placeholder="Prix vente" value={form.prixVente} onChange={(e) => setForm({ ...form, prixVente: e.target.value })} required />
            <input type="number" placeholder="Quantité" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} required />
          </div>
          <div className="form-row">
            <input type="date" value={form.dateExpiration} onChange={(e) => setForm({ ...form, dateExpiration: e.target.value })} required />
            <input placeholder="Fabricant" value={form.fabricant} onChange={(e) => setForm({ ...form, fabricant: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">{editing ? "Modifier" : "Créer"}</button>
        </form>
      )}

      <input className="search-input" placeholder="🔍 Rechercher un médicament..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <p className="loading-msg">⏳ Chargement...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th><th>Catégorie</th><th>Prix achat</th><th>Prix vente</th><th>Stock</th><th>Expiration</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => (
              <tr key={med.id} className={isExpired(med.dateExpiration) ? "row-expired" : med.quantite <= 10 ? "row-warning" : ""}>
                <td>{med.nom}</td>
                <td>{med.categorie}</td>
                <td>{med.prixAchat} FCFA</td>
                <td>{med.prixVente} FCFA</td>
                <td>{med.quantite}</td>
                <td>{new Date(med.dateExpiration).toLocaleDateString()}</td>
                <td>
                  <button className="btn-small" onClick={() => handleEdit(med)}>✏️</button>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(med.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Medicaments;
