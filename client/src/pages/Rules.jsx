function Rules() {
  // Variables
  const lastUpdated = "October 13, 2024";
  const websiteName = "UUMF";
  const contactEmail = "teamuumf@gmail.com";

  return (
    <main>
      {/* Rules Header */}
      <section className="page__header">
        <h1>UUMF Rules</h1>
        <span>Last updated: {lastUpdated}</span>
      </section>

      {/* Rules */}
      <section className="page__content">
        <p>
          Welcome to {websiteName}! To ensure a positive experience for all
          users, please adhere to the following rules:
        </p>

        <h2>1. Respect and Civility</h2>
        <ul>
          <li>
            Treat all members with respect, regardless of their taste in music
            or opinions.
          </li>
          <li>No personal attacks, insults, or harassment of any kind.</li>
          <li>
            Disagreements should be expressed politely and constructively.
          </li>
        </ul>

        <h2>2. Content Guidelines</h2>
        <ul>
          <li>
            Posts must be related to underground music or the forum's topic.
          </li>
          <li>
            No spam, advertisements, or self-promotion without prior approval
            from moderators.
          </li>
          <li>Avoid duplicate posts or excessive bumping of threads.</li>
          <li>
            Use appropriate content warnings for sensitive or explicit material.
          </li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <ul>
          <li>
            Respect copyright laws. Do not share illegal downloads or
            unauthorized streaming links.
          </li>
          <li>
            When sharing content created by others, provide proper attribution.
          </li>
        </ul>

        <h2>4. User Accounts</h2>
        <ul>
          <li>
            One account per user. Multiple accounts (sockpuppets) are not
            allowed.
          </li>
          <li>
            Choose an appropriate username. Offensive or misleading usernames
            are prohibited.
          </li>
          <li>Do not impersonate other users, artists, or public figures.</li>
        </ul>

        <h2>5. Forum-Specific Rules</h2>
        <ul>
          <li>Use the appropriate sub-forum or thread for your posts.</li>
          <li>
            Follow any additional rules posted in specific sub-forums or sticky
            threads.
          </li>
          <li>Respect the purpose of each sub-forum and stay on topic.</li>
        </ul>

        <h2>6. Moderation</h2>
        <ul>
          <li>
            Moderator decisions are final. Do not argue with moderators in
            public threads.
          </li>
          <li>
            If you disagree with a moderation decision, contact the admin team
            privately.
          </li>
          <li>
            Do not backseat moderate. Report rule violations instead of
            confronting users yourself.
          </li>
        </ul>

        <h2>7. Mature Content</h2>
        <ul>
          <li>No pornographic or extremely graphic violent content.</li>
          <li>
            Discussions of mature themes must be properly tagged and should not
            be gratuitous.
          </li>
        </ul>

        <h2>8. External Links</h2>
        <ul>
          <li>Only post links to safe, legitimate websites.</li>
          <li>Clearly describe where a link leads before posting it.</li>
        </ul>

        <h2>9. Language and Communication</h2>
        <ul>
          <li>
            English is the primary language of the forum. Use other languages
            only in designated areas.
          </li>
          <li>Avoid excessive use of caps lock, emojis, or text speak.</li>
        </ul>

        <h2>10. Reporting and Feedback</h2>
        <ul>
          <li>Report rule violations using the provided reporting feature.</li>
          <li>
            Provide constructive feedback about the forum through appropriate
            channels.
          </li>
        </ul>

        <p>
          Failure to comply with these rules may result in warnings, temporary
          bans, or permanent account termination, at the discretion of the
          moderation team.
        </p>

        <p>
          Remember, these rules are in place to foster a positive and enriching
          community for underground music enthusiasts. If you have any questions
          about the rules, please contact us at {contactEmail}.
        </p>
      </section>
    </main>
  );
}

export default Rules;
