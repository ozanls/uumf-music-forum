import React from "react";
import Tag from "./Tag";
import BasicButton from "./buttons/BasicButton";

function BoardCard(props) {
  const { board } = props;

  return (
    <div className="board__header">
      {/* Board Header Left (title, subtitle, visit button) */}
      <div className="board__header__left">
        <h2 className="board__header__subtitle">/{board.name}/</h2>
        <h1 className="board__header__title">{board.description}</h1>
        <BasicButton
          text={`Visit /${board.name}/`}
          handleAction={() => (window.location.href = `/b/${board.name}`)}
        />{" "}
      </div>

      {/* Board Header Right (trending tags) */}
      <div className="board__header__right">
        {board.trendingTags.length !== 0 && (
          <>
            <h3>Trending Tags</h3>
            <ul className="tags">
              {board.trendingTags &&
                board.trendingTags.map((trendingTag) => (
                  <li key={trendingTag.id}>
                    <Tag tag={trendingTag.tag} />
                  </li>
                ))}
            </ul>
          </>
        )}

        {/* If there are no trending tags, display a message */}
        {board.trendingTags.length === 0 && (
          <>
            <h3>No trending tags...</h3>
          </>
        )}

        {/* Button to view more tags */}
        <BasicButton
          text={`More /${board.name}/ Tags`}
          handleAction={() => (window.location.href = `/b/${board.name}/tags`)}
        />
      </div>
    </div>
  );
}

export default BoardCard;
