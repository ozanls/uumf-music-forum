import React from "react";
import BoardsList from "./BoardsList";

function Home() {
  return (
    <main>
      <section className="page__header">
        <h1>UUMF</h1>
        <button
          className="basic-button"
          onClick={() => (window.location.href = "/about")}
        >
          What is UUMF?
        </button>
      </section>
      <BoardsList />
    </main>
  );
}

export default Home;
