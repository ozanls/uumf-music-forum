function Footer() {
  return (
    <footer>
      <div className="footer-section">
        <a href="/">
          <span className="logo">UUMF</span>
        </a>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
      <div className="footer-section">
        <h4 className="footer-subtitle">Quick Links</h4>
        <ul className="footer-links">
          <li>
            <a href="/about">What is UUMF?</a>
          </li>
          <li>
            <a href="/rules">Site Rules</a>
          </li>
          <li>
            <a href="/terms">Terms and Conditions</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h4 className="footer-subtitle">Contact Us</h4>
        <p>teamuumf@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer;
