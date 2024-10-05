function BoardCard(props) {
    
const { board } = props;

  return (
    <div>
      <h2>
        {board.name}
    </h2>
    <p> 
        {board.description}
    </p>
    <a href={`/b/${board.name}`}>
        <div>Visit /{board.name}/</div>
    </a>
    </div>
  );
}

export default BoardCard