import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/apiServices';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll();
        setProducts(data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading awesome products...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* Hero Banner */}
      <div className="hero-banner mb-5">
        <Row className="align-items-center">
          <Col lg={7} className="mb-4 mb-lg-0">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="feature-pill">
                <i className="bi bi-lightning-charge-fill text-warning"></i> Fast Express Delivery
              </span>
              <span className="feature-pill">
                <i className="bi bi-shield-check text-info"></i> 100% Secure Checkout
              </span>
            </div>
            <h1 className="display-4 fw-extrabold mb-3 text-white">
              Discover Exclusive Products <br />
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #e0e7ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                At Unbeatable Prices
              </span>
            </h1>
            <p className="lead text-light opacity-75 mb-4" style={{ maxWidth: 540 }}>
              Upgrade your shopping experience today. Explore top-tier items across fashion, electronics, home essentials and more.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button as={Link} to="/products" className="btn-gradient btn-lg px-4 py-2.5">
                Explore Collection <i className="bi bi-arrow-right ms-2"></i>
              </Button>
              <Button as={Link} to="/register" variant="outline-light" className="btn-lg px-4 py-2.5 rounded-3">
                Join Shoppify
              </Button>
            </div>
          </Col>
          <Col lg={5} className="text-center">
            <div className="p-4 rounded-4 bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-10 shadow-lg position-relative">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
                alt="Shopping Store"
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: 320, objectFit: 'cover', width: '100%' }}
              />
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 bg-dark bg-opacity-75 text-white px-3 py-1 rounded-pill small">
                🔥 Summer Trends 2026
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Trust Badges */}
      <Row className="g-4 mb-5 text-center">
        <Col md={3} sm={6}>
          <div className="p-3 bg-white trust-card shadow-sm h-100 d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-3">
              <i className="bi bi-truck"></i>
            </div>
            <div className="text-start">
              <h6 className="fw-bold mb-0">Free Shipping</h6>
              <small className="text-muted">On orders over $50</small>
            </div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div className="p-3 bg-white trust-card shadow-sm h-100 d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-3">
              <i className="bi bi-arrow-counterclockwise"></i>
            </div>
            <div className="text-start">
              <h6 className="fw-bold mb-0">Easy Returns</h6>
              <small className="text-muted">30 Days Return Guarantee</small>
            </div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div className="p-3 bg-white trust-card shadow-sm h-100 d-flex align-items-center gap-3">
            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-3">
              <i className="bi bi-lock-fill"></i>
            </div>
            <div className="text-start">
              <h6 className="fw-bold mb-0">Secure Payment</h6>
              <small className="text-muted">100% Encrypted Transactions</small>
            </div>
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div className="p-3 bg-white trust-card shadow-sm h-100 d-flex align-items-center gap-3">
            <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-3">
              <i className="bi bi-headset"></i>
            </div>
            <div className="text-start">
              <h6 className="fw-bold mb-0">24/7 Support</h6>
              <small className="text-muted">Dedicated Assistance</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Category Pills & Section Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold mb-1">Featured Products</h2>
          <p className="text-muted mb-0">Handpicked collection of trending products</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
          <i className="bi bi-box-seam fs-1 text-muted d-block mb-3"></i>
          <h5>No products available</h5>
          <p className="text-muted">Check back later or explore other categories!</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
