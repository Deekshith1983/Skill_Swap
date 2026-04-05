import { useEffect, useState } from "react";
import API from "../services/api";
import UserCard from "../components/UserCard";

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

 useEffect(() => {
  API.get("/match")
    .then(res => setUsers(res.data.matches))
    .catch(err => console.log(err));
}, []);

const filtered = users.filter(u =>
  (u.skillsOffered || [])
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div className="container">
      <h2>Search Users</h2>

      <input
        placeholder="Search skills..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">
        {filtered.map(item => (
          <UserCard key={item.user._id} user={item.user} />
        ))}
      </div>
    </div>
  );
}
