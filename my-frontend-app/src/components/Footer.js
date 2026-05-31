// Bottom bar of the content area.
export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__brand">Pawtrait Studio</span>
      <span className="footer__links">
        Terms of Service · Privacy Policy · Contact Support
      </span>
      <span className="footer__copy">
        © {new Date().getFullYear()} Pawtrait Studio. All rights reserved.
      </span>
    </footer>
  );
}
