import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer-custom py-5 mt-auto">
    <Container>
      <Row className="g-4 mb-4">
        <Col lg={4} md={6}>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-bag-heart-fill me-2 text-primary fs-4"></i>
            <span className="brand-gradient fs-4">Shoppify</span>
          </div>
          <p className="small footer-text mb-3">
            Your premier destination for high-quality products at unbeatable prices. Experience fast shipping, secure payment, and premium customer service.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="social-icon-btn"><i className="bi bi-facebook fs-5"></i></a>
            <a href="#" className="social-icon-btn"><i className="bi bi-twitter-x fs-5"></i></a>
            <a href="#" className="social-icon-btn"><i className="bi bi-instagram fs-5"></i></a>
            <a href="#" className="social-icon-btn"><i className="bi bi-linkedin fs-5"></i></a>
          </div>
        </Col>

        <Col lg={2} md={6} xs={6}>
          <h6 className="text-white fw-bold mb-3">Shop</h6>
          <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
            <li><Link to="/products" className="footer-link">All Products</Link></li>
            <li><Link to="/products?category=Electronics" className="footer-link">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="footer-link">Fashion</Link></li>
            <li><Link to="/products?category=Home" className="footer-link">Home & Living</Link></li>
          </ul>
        </Col>

        <Col lg={2} md={6} xs={6}>
          <h6 className="text-white fw-bold mb-3">Account</h6>
          <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
            <li><Link to="/dashboard" className="footer-link">My Account</Link></li>
            <li><Link to="/my-orders" className="footer-link">Order History</Link></li>
            <li><Link to="/wishlist" className="footer-link">Wishlist</Link></li>
            <li><Link to="/cart" className="footer-link">Shopping Cart</Link></li>
          </ul>
        </Col>

        <Col lg={4} md={6}>
          <h6 className="text-white fw-bold mb-3">Customer Support</h6>
          <div className="d-flex flex-column gap-2 small footer-text">
            <div><i className="bi bi-geo-alt me-2 text-primary"></i> 123 Commerce Way, Tech City</div>
            <div><i className="bi bi-envelope me-2 text-primary"></i> support@shoppify.com</div>
            <div><i className="bi bi-telephone me-2 text-primary"></i> +1 (800) 123-4567</div>
          </div>
        </Col>
      </Row>

      <hr className="border-secondary opacity-25 my-4" />

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small footer-text gap-2">
        <p className="mb-0">&copy; {new Date().getFullYear()} Shoppify Inc. Built with MERN Stack.</p>
        <div className="d-flex gap-3">
          <Link to="#" className="footer-link">Privacy Policy</Link>
          <Link to="#" className="footer-link">Terms of Service</Link>
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
