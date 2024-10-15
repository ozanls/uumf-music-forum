function NavDropdown(props) {
  const { user, logOut } = props;

  return (
    // Nav Menu
    <ul className="nav__menu">
      {/* If user is an admin, show Admin Menu option*/}
      {user && user.role === "admin" && (
        <li>
          <a href="/admin">
            <i className="fa-solid fa-toolbox"></i> Admin Menu
          </a>
        </li>
      )}

      {/* My Profile */}
      <li>
        <a href={`/u/${user.username}`}>
          <i className="fa-solid fa-user"></i> My Profile
        </a>
      </li>

      {/* Log Out */}
      <li>
        <a onClick={() => logOut()}>
          <i className="fa-solid fa-right-from-bracket"></i> Log Out
        </a>
      </li>
    </ul>
  );
}

export default NavDropdown;
