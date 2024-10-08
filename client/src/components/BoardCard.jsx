function BoardCard(props) {
  const { board } = props;

  return (
    <div className="boards__card">
      <h2>/{board.name}/</h2>
      <p>{board.description}</p>
      <a href={`/b/${board.name}`}>
        <button>Visit /{board.name}/</button>
      </a>
    </div>
  );
}

export default BoardCard;
