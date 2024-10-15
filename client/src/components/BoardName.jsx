function BoardName(props) {
  const { board } = props;

  return (
    // Display the board name with a link to the board
    <a href={`/b/${board.name}`}>
      <span className="username"> /{board.name}/ </span>
    </a>
  );
}

export default BoardName;
