function AdminUsers(props) {
  const { users, handleUserSearch, roles, handleRoleChange, handleSubmitUser } =
    props;

  return (
    <section className="admin__users">
      <h2>Users</h2>

      {/* User Search Form */}
      <form onSubmit={handleUserSearch}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
        />
        <button className="basic-button" type="submit">
          Search
        </button>
      </form>

      {/* If there are no users, display a message */}
      {users.length === 0 && <p>No users found</p>}

      {/* If there are users, display the users table */}
      {users.length > 0 && (
        <>
          {/* Users Table */}
          <table>
            {/* Table Headers */}
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

            {/* Table Body */}
            <tbody>
              {/* Map through users and display each user */}
              {users.map((user) => (
                <tr key={user.id}>
                  {/* Display the user's username and email */}
                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  {/* Display a dropdown to change the user's role */}
                  <td>
                    <select
                      value={roles[user.id] || user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      {/* Map through roles and display each role */}
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="vip">VIP</option>
                      <option value="user">User</option>
                    </select>
                  </td>

                  {/* Display whether the user has confirmed their email */}
                  <td>{user.confirmedEmail ? "Yes" : "No"}</td>

                  {/* Display whether the user wants to receive promotional emails */}
                  <td>{user.receivePromo ? "Yes" : "No"}</td>

                  {/* Display the user's creation date */}
                  <td>{new Date(user.createdAt).toLocaleString()}</td>

                  {/* Display a save button */}
                  <td>
                    <button
                      className="basic-button-2"
                      onClick={() => handleSubmitUser(user.id)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

export default AdminUsers;
