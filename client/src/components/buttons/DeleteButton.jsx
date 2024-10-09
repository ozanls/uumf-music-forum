function DeleteButton(props) {
  const { handleAction, text } = props;
  return (
    <button className="delete-button" onClick={handleAction}>
      <span> {text}</span>
    </button>
  );
}

export default DeleteButton;
