import { useState } from "react";
import alterHex from "../utilities/alterHex";

function Tag(props) {
  const { tag } = props;
  const [isHovered, setIsHovered] = useState(false);

  // When the mouse enters or leaves the tag, toggle the isHovered state
  const handleMouseAction = () => {
    setIsHovered(!isHovered);
  };

  // Alter the hex code of the tag to create a hover color
  const hoverColor = alterHex(tag.hexCode, -20);

  return (
    // Link to the tag details page
    <a href={`/b/${tag.board.name.toString()}/tag/${tag.name}`}>
      <div
        className="tag"
        // Set the background color of the tag to the tag's hex code or the hover color, depending on whether the tag is hovered.
        style={{
          backgroundColor: isHovered ? hoverColor : tag.hexCode,
          transition: "0.3s",
        }}
        // When the mouse enters or leaves the tag, call the appropriate function
        onMouseEnter={handleMouseAction}
        onMouseLeave={handleMouseAction}
      >
        #{tag.name}
      </div>
    </a>
  );
}

export default Tag;
