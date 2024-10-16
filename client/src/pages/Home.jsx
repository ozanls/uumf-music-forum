import React from "react";
import BoardsList from "../components/BoardsList";
import BasicButton from "../components/buttons/BasicButton";
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
          <BasicButton
            handleAction={() => (window.location.href = "/about")}
            text="What is UUMF?"
          />
        </span>
      </section>

      {/* Boards List */}
      <BoardsList />
    </main>
  );
}

export default Home;
