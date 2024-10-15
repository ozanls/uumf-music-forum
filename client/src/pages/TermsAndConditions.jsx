function TermsAndConditions() {
  const lastUpdated = "October 13, 2024";
  const companyName = "Unnamed Underground Music Forum (UUMF)";
  const contactEmail = "teamuumf@gmail.com";

  return (
    <main>
      {/* Terms and Conditions Header */}
      <section className="page__header">
        <h1>UUMF Terms and Conditions</h1>
        <span>Last updated: {lastUpdated}</span>
      </section>

      {/* Terms and Conditions */}
      <section className="page__content">
        <p>
          Please read these Terms and Conditions ("Terms", "Terms and
          Conditions") carefully before using the Unnamed Underground Music
          Forum (UUMF) website (the "Service") operated by {companyName} ("us",
          "we", or "our").
        </p>

        <h2>1. Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate,
          complete, and up-to-date information. Failure to do so constitutes a
          breach of the Terms, which may result in immediate termination of your
          account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to
          access the Service and for any activities or actions under your
          password.
        </p>
        <p>
          You agree not to disclose your password to any third party. You must
          notify us immediately upon becoming aware of any breach of security or
          unauthorized use of your account.
        </p>

        <h2>2. Age Restriction</h2>
        <p>
          The Service is intended for users who are at least 16 years of age. By
          using the Service, you represent and warrant that you are at least 16
          years old. If you are under 16 years old, you may not use or access
          the Service at any time or in any manner.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by
          users), features, and functionality are and will remain the exclusive
          property of {companyName} and its licensors. The Service is protected
          by copyright, trademark, and other laws of both Canada and foreign
          countries. Our trademarks and trade dress may not be used in
          connection with any product or service without the prior written
          consent of {companyName}.
        </p>

        <h2>4. User-Generated Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make
          available certain information, text, graphics, videos, or other
          material ("Content"). You are responsible for the Content that you
          post to the Service, including its legality, reliability, and
          appropriateness.
        </p>

        <h2>5. Prohibited Content and Conduct</h2>
        <p>
          You agree not to use the Service to post or transmit any content that:
        </p>
        <ul>
          <li>
            Is unlawful, harmful, threatening, abusive, harassing, defamatory,
            vulgar, obscene, or invasive of another's privacy
          </li>
          <li>
            Promotes racism, bigotry, hatred, or physical harm of any kind
            against any group or individual
          </li>
          <li>
            Infringes on any patent, trademark, trade secret, copyright, or
            other proprietary rights of any party
          </li>
          <li>
            Contains software viruses or any other computer code designed to
            interrupt, destroy, or limit the functionality of any computer
            software or hardware
          </li>
        </ul>

        <h2>6. Moderation and Account Termination</h2>
        <p>
          We reserve the right, but not the obligation, to monitor all Content
          posted on the Service. We may, in our sole discretion, delete, move,
          or edit any Content that violates these Terms or that we otherwise
          find objectionable.
        </p>

        <h2>7. Privacy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy,
          which explains how we collect, use, and disclose information about
          you.
        </p>

        <h2>8. Cookies</h2>
        <p>
          We use cookies to authenticate users and maintain session information.
          By using our Service, you consent to the use of cookies in accordance
          with our Privacy Policy.
        </p>

        <h2>9. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will try to
          provide at least 30 days' notice prior to any new terms taking effect.
          What constitutes a material change will be determined at our sole
          discretion.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          {contactEmail}.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of Canada, without regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights. If any provision of these
          Terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these Terms will remain in effect.
        </p>
        <p>
          By using the Unnamed Underground Music Forum (UUMF), you acknowledge
          that you have read, understood, and agree to be bound by these Terms
          and Conditions.
        </p>
      </section>
    </main>
  );
}

export default TermsAndConditions;
