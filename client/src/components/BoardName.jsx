function BoardName(props) {
  const { board } = props;

  return (
    <a href={`/b/${board.name}`}>
      <span className="username"> /{board.name}/ </span>
    </a>
  );
}

export default BoardName;
