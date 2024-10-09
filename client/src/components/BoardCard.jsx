function BoardCard(props) {
  const { board } = props;

  return (
    <div className="board-card">
      <span>/{board.name}/</span>
      <h2>{board.description}</h2>
      <a href={`/b/${board.name}`}>
        <button>Visit /{board.name}/</button>
      </a>
    </div>
  );
}

export default BoardCard;
