function BasicButton(props) {
  const { handleAction, text } = props;
  return (
    <button className="basic-button" onClick={handleAction}>
      <span> {text}</span>
    </button>
  );
}

export default BasicButton;
