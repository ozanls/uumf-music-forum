function Message(props) {
  const { type, message } = props;
  let messageClass;

  // If there is no message, return null
  if (!message) return null;

  // Set the message class based on the type
  // If type is error, set the message class to error-message
  if (type === "error") {
    messageClass = "error-message";

    // If type is success, set the message class to success-message
  } else if (type === "success") {
    messageClass = "success-message";

    // Else, set the message class to info-message
  } else {
    messageClass = "info-message";
  }

  // Return the message in a div with the message class
  return <div className={messageClass}>{message}</div>;
}

export default Message;
