function Message(props) {
  const { type, message } = props;
  let messageClass;

  if (!message) return null;

  if (type === "error") {
    messageClass = "error-message";
  } else if (type === "success") {
    messageClass = "success-message";
  } else {
    messageClass = "info-message";
  }

  return <div className={messageClass}>{message}</div>;
}

export default Message;
