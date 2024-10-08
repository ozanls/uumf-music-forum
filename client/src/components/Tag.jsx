function Tag(props) {
  const { tag } = props;

  return (
    <a href={`/t/${tag.name}`}>
      <div className="tag" style={{ backgroundColor: tag.hexCode }}>
        #{tag.name}
      </div>
    </a>
  );
}

export default Tag;
