import { useState, useEffect } from "react";
import UserCard from "./UserCard";

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function UserList() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        const formatted = data.slice(0, 6).map((u, i) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          city: u.address.city,
          color: COLORS[i % COLORS.length],
        }));
        setUsers(formatted);
        setApiLoaded(true);
        setLoading(false);
      })
      .catch(() => {
        setError("API indisponible. Affichage des données locales.");
        setUsers([
          {
            id: 1,
            name: "Ali Hassan",
            email: "ali@email.com",
            phone: "0600000001",
            city: "N'Djamena",
            color: COLORS[0],
          },
          {
            id: 2,
            name: "Sara Mahamat",
            email: "sara@email.com",
            phone: "0600000002",
            city: "Moundou",
            color: COLORS[1],
          },
        ]);
        setLoading(false);
      });
  }, []);

  const addUser = () => {
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim();

    if (!trimmedName || !trimmedEmail) return;

    const alreadyExists = users.some(
      (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (alreadyExists) {
      alert("Cet utilisateur existe déjà !");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      phone: "",
      city: "",
      color: COLORS[users.length % COLORS.length],
    };

    setUsers([...users, newUser]);
    setNewName("");
    setNewEmail("");
  };

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="user-list-section">
      <div className="section-bar">
        <h2>
          Utilisateurs{" "}
          <span className="count-badge">{filteredUsers.length}</span>
        </h2>
        {apiLoaded && <span className="api-badge">✅ API chargée</span>}
      </div>

      {error && <p className="error-msg">⚠️ {error}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="add-form">
        <input
          type="text"
          placeholder="Nom"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className="btn-add" onClick={addUser}>
          + Ajouter
        </button>
      </div>

      {loading && <p className="loading-msg">⏳ Chargement des données...</p>}

      {!loading && filteredUsers.length === 0 && (
        <p className="empty-msg">Aucun utilisateur trouvé.</p>
      )}

      <div className="cards-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card-wrapper">
            <UserCard
              name={user.name}
              email={user.email}
              phone={user.phone}
              city={user.city}
              color={user.color}
            />
            <button
              className="btn-delete"
              onClick={() => removeUser(user.id)}
            >
              🗑 Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
