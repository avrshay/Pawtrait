//Bottom bar of the content area.
export default function Footer() {
  return (
    <footer className="Footer">
      <span className="footer__brand">Pawtrait Studio</span>
      
      <span className="footer__copy">
        © {new Date().getFullYear()} Pawtrait Studio. All rights reserved.
      </span>
    </footer>
  );
}

