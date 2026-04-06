import{ useState } from "react";

export default function Navbar({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const handleLogout = () => {
    onLogout();
    setShowMenu(false);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <a href="/dashboard" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          SkillSwap
        </a>

        {user && (
          <div style={styles.nav_links}>
            <a href="/dashboard" style={styles.link}>Dashboard</a>
            <a href="/search" style={styles.link}>Search</a>
            <a href="/requests" style={styles.link}>Requests</a>
            <a href="/schedule" style={styles.link}>Schedule</a>
            <a href="/profile/me" style={styles.link}>Profile</a>
          </div>
        )}

        {user && (
          <div style={styles.user_section}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={styles.avatar_btn}
              title={user.name}
            >
              <div style={styles.avatar}>
                {getInitials(user.name)}
              </div>
            </button>

            {showMenu && (
              <div style={styles.dropdown}>
                <div style={styles.dropdown_item}>{user.name}</div>
                <div style={styles.dropdown_item_secondary}>{user.email}</div>
                <div style={styles.dropdown_divider}></div>
                <a href="/profile/me" style={styles.dropdown_item}>Profile</a>
                <button
                  onClick={handleLogout}
                  style={styles.logout_btn}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "var(--bg-primary)",
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "var(--shadow-sm)"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "var(--spacing-md) var(--spacing-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "var(--primary-blue)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "150px"
  },
  logoIcon: {
    fontSize: "24px"
  },
  nav_links: {
    display: "flex",
    gap: "var(--spacing-lg)",
    flex: 1,
    justifyContent: "center"
  },
  link: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s"
  },
  user_section: {
    position: "relative"
  },
  avatar_btn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "var(--primary-blue)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    minWidth: "200px",
    zIndex: 1000
  },
  dropdown_item: {
    padding: "12px 16px",
    color: "var(--text-primary)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },
  dropdown_item_secondary: {
    padding: "8px 16px",
    color: "var(--text-tertiary)",
    fontSize: "12px"
  },
  dropdown_divider: {
    height: "1px",
    background: "var(--border-light)"
  },
  logout_btn: {
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    color: "var(--error)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left"
  }
};
