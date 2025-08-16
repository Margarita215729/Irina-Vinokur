import { Link } from 'react-router-dom';
import { Palette, Mail, Phone, MapPin, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Palette className="logo-icon" />
              <span className="logo-text">Irina Vinokur</span>
            </div>
            <p className="footer-description">
              Capturing the beauty of nature through impressionist art, 
              inspired by the masters like Claude Monet.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <nav className="footer-nav">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/portfolio" className="footer-link">Portfolio</Link>
              <Link to="/portfolio?for_sale=true" className="footer-link">Shop</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>contact@irinavinokur.art</span>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <span>Artist Studio, Creative District</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Newsletter</h3>
            <p className="newsletter-description">
              Stay updated with new artworks and exhibitions.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © 2024 Irina Vinokur. All rights reserved. Made with{' '}
              <Heart className="heart-icon" /> for art lovers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;