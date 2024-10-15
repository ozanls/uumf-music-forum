function Username(props) {
  const { user } = props;

  return (
    // Display the username with a link to the user's profile
    <a href={`/u/${user.username}`}>
      <span className="username"> @{user.username} </span>
    </a>
  );
}

export default Username;
