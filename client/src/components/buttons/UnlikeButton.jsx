function UnlikeButton(props) {
  const { handleAction, text } = props;
  return (
    <button className="unlike-button" onClick={handleAction}>
      <i className="fa-solid fa-heart unlike"></i>
      <span> {text}</span>
    </button>
  );
}

export default UnlikeButton;
