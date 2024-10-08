function BoardCard(props) {
  const { board } = props;

  return (
    <div className="board-card">
      <h2>/{board.name}/</h2>
      <h3>{board.description}</h3>
      <a href={`/b/${board.name}`}>
        <button>Visit /{board.name}/</button>
      </a>
    </div>
  );
}

export default BoardCard;
