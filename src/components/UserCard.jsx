function UserCard({ name, email, phone, city, color }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="user-card"
      style={{ borderTop: `4px solid ${color || "#6366f1"}` }}
    >
      <div className="user-card-header">
        <div
          className="user-avatar"
          style={{ background: color || "#6366f1" }}
        >
          {initials}
        </div>
        <div>
          <h2 className="user-name">{name}</h2>
          <p className="user-email">{email}</p>
        </div>
      </div>

      <div className="user-card-body">
        {city && (
          <p className="user-info">
            <span className="info-label">📍 Ville</span>
            <span>{city}</span>
          </p>
        )}
        {phone && (
          <p className="user-info">
            <span className="info-label">📞 Téléphone</span>
            <span>{phone}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default UserCard;
