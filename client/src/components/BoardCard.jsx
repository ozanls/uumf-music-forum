import React from "react";
import Tag from "./Tag";
import BasicButton from "./buttons/BasicButton";

function BoardCard(props) {
  const { board } = props;

  return (
    <div className="board__header">
      <div className="board__header__left">
        <h2 className="board__header__subtitle">/{board.name}/</h2>
        <h1 className="board__header__title">{board.description}</h1>
        <a href={`/b/${board.name}`}>
          <button className="basic-button">Visit /{board.name}/</button>
        </a>
      </div>
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
      </div>
    </div>
  );
}

export default BoardCard;
