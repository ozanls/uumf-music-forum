function Username(props) {
  const { user } = props;

  return (
    <a href={`/u/${user.username}`}>
      <span className="username"> @{user.username} </span>
    </a>
  );
}

export default Username;
