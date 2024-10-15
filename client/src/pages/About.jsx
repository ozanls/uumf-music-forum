import usePageTitle from "../utilities/usePageTitle";

const siteName = "UUMF";

function About() {
  usePageTitle(`About`);
  return (
    <main>
      {/* About Page Header */}
      <section className="page__header">
        <h1>What is {siteName}?</h1>
      </section>

      {/* About Page Content */}
      <section className="page__content">
        <p>
          {siteName} is a vibrant online community dedicated to exploring and
          celebrating the depths of underground music scenes. We provide a
          platform for musicians, listeners, and enthusiasts to connect, share,
          and discuss the latest in underground music across various genres.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to foster a supportive environment where emerging
          artists can showcase their work, receive constructive feedback, and
          connect with like-minded individuals. We aim to be the go-to hub for
          discovering hidden musical gems and engaging in meaningful discussions
          about the underground music world.
        </p>

        <h2>Join Our Community</h2>
        <p>
          Whether you're a musician looking to share your latest tracks, a
          devoted fan searching for new sounds, or simply curious about the
          underground music scene, {siteName} welcomes you. Join us in our
          journey to unearth and celebrate the most exciting underground music!
        </p>
      </section>
    </main>
  );
}

export default About;
