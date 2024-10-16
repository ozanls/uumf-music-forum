import { useState } from "react";
import UserCard from "./UserCard";

function Username(props) {
  const { user } = props;
  const [isHovered, setIsHovered] = useState(false);

  // When the mouse enters or leaves the username, toggle the isHovered state
  const handleMouseAction = () => {
    setIsHovered(!isHovered);
  };

  return (
    // Display the username with a link to the user's profile
    <>
      <a href={`/u/${user.username}`}>
        <span
          className="username"
          onMouseEnter={handleMouseAction}
          onMouseLeave={handleMouseAction}
        >
          {" "}
          @{user.username}{" "}
        </span>
      </a>
      {/* {isHovered && <UserCard user={user} />} */}
    </>
  );
}

export default Username;
