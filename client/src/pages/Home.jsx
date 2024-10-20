import React from "react";
import BoardsList from "../components/BoardsList";
import usePageTitle from "../utilities/usePageTitle";

function Home() {
  // Set the page title
  usePageTitle("Home");

  return (
    <main>
      {/* Home Page Header */}
      <section className="page__header">
        <h1>UUMF</h1>
        <span className="button-list">
          <button
            className="basic-button"
            onClick={() => (window.location.href = "/about")}
          >
            What is UUMF?
          </button>
        </span>
      </section>

      {/* Boards List */}
      <BoardsList />
    </main>
  );
}

export default Home;
