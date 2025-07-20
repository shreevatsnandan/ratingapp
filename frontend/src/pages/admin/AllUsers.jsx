import { useEffect, useState } from "react";

const AllUsers = () => {
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [ratings, setRatings] = useState({}); // { userId: { avg, total } }
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/getuser/users`);
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
      fetchRatingsForStoreOwners(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch ratings for storeowners only
  const fetchRatingsForStoreOwners = async (usersList) => {
    const storeOwners = usersList.filter((user) => user.role === "storeowner");
    const newRatings = {};

    await Promise.all(
      storeOwners.map(async (user) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/getuser/store-rating/${user.id}`);
          const ratingData = await res.json();
          newRatings[user.id] = {
            avg: ratingData.averageRating,
            total: ratingData.totalRatings,
          };
        } catch (err) {
          console.error("Error fetching rating for", user.id);
        }
      })
    );

    setRatings(newRatings);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(newFilters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(newFilters.email.toLowerCase()) &&
        user.address.toLowerCase().includes(newFilters.address.toLowerCase()) &&
        (newFilters.role === "" || user.role === newFilters.role)
      );
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <input
            name="name"
            placeholder="Name"
            className="border p-2 rounded"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            name="address"
            placeholder="Address"
            className="border p-2 rounded"
            value={filters.address}
            onChange={handleFilterChange}
          />
          <select
            name="role"
            className="border p-2 rounded"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="storeowner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  {user.role === "storeowner" ? (
                    ratings[user.id] ? (
                      <>
                        ⭐ {Number(ratings[user.id].avg || 0).toFixed(1)} / 5

                        <br />
                        🗳️ {ratings[user.id].total} reviews
                      </>
                    ) : (
                      "Loading..."
                    )
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
