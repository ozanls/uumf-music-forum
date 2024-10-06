function Tag(props) {
  const { tag } = props;

  return (
    <a href={`/t/${tag.name}`}>
      <div style={{ backgroundColor: tag.hexCode }} className="board-tag">
        <p style={{ textTransform: "uppercase" }}>#{tag.name}</p>
      </div>
    </a>
  );
}

export default Tag;
