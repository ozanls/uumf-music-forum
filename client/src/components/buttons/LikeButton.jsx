function UnlikeButton(props) {
  const { handleAction, text } = props;
  return (
    <button className="like-button" onClick={handleAction}>
      <i className="fa-regular fa-heart like"></i>
      <span> {text}</span>
    </button>
  );
}

export default UnlikeButton;
