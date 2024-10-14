function AdminUsers(props) {
  const { users, handleUserSearch, roles, handleRoleChange, handleSubmitUser } =
    props;

  return (
    <>
      <h2>Users</h2>
      <form onSubmit={handleUserSearch}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
        />
        <button type="submit">Search</button>
      </form>
      {users.length === 0 && <p>No users found</p>}
      {users.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Confirmed Email</th>
                <th>Receive Promo</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={roles[user.id] || user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="vip">VIP</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td>{user.confirmedEmail ? "Yes" : "No"}</td>
                  <td>{user.receivePromo ? "Yes" : "No"}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleSubmitUser(user.id)}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default AdminUsers;
