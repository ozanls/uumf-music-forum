import usePageTitle from "../utilities/usePageTitle";

function PageNotFound() {
  // Set the page title
  usePageTitle("404");

  return (
    <main>
      {/* Page Not Found Header */}
      <section className="page__header">
        <h1>404</h1>
        <p>Page not found</p>
        <button className="basic-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </section>
    </main>
  );
}

export default PageNotFound;
