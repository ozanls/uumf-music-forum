import { useState } from "react";
import alterHex from "../utilities/alterHex";

function Tag(props) {
  const { tag } = props;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const hoverColor = alterHex(tag.hexCode, -20);
  return (
    <a href={`/b/${tag.board.name.toString()}/${tag.name}`}>
      <div
        className="tag"
        style={{
          backgroundColor: isHovered ? hoverColor : tag.hexCode,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        #{tag.name}
      </div>
    </a>
  );
}

export default Tag;
