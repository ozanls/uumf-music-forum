import BasicButton from "../components/buttons/BasicButton";
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
        <BasicButton
          handleAction={() => (window.location.href = "/")}
          text="Go Home"
        />
      </section>
    </main>
  );
}

export default PageNotFound;
