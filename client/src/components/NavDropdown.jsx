function NavDropdown(props) {
  const { user, logOut, setShowDropdown } = props;

  return (
    <ul className="nav__menu">
      {user && user.role === "admin" && (
        <li>
          <a href="/admin">
            <i class="fa-solid fa-toolbox"></i> Admin Menu
          </a>
        </li>
      )}
      <li>
        <a href={`/u/${user.username}`}>
          <i class="fa-solid fa-user"></i> My Profile
        </a>
      </li>

      <li>
        <a href="/new">
          <i class="fa-solid fa-plus"></i> Create a Post
        </a>
      </li>

      <li>
        <a onClick={() => logOut()}>
          <i class="fa-solid fa-right-from-bracket"></i> Log Out
        </a>
      </li>
      <li>
        <a onClick={() => setShowDropdown(false)}>
          <i class="fa-regular fa-circle-xmark"></i> Close
        </a>
      </li>
    </ul>
  );
}

export default NavDropdown;
