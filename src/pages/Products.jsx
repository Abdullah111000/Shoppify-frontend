import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { productAPI } from '../services/apiServices';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll();
        setProducts(data.products);
        setFiltered(data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'all') {
      result = result.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading product catalog...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-extrabold mb-1">Explore Products</h2>
          <p className="text-muted mb-0">Showing {filtered.length} products in catalog</p>
        </div>
      </div>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      <div className="bg-white p-3.5 rounded-4 shadow-sm border mb-4">
        <Row className="g-3 align-items-center">
          <Col md={7}>
            <InputGroup className="border rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-white border-0 text-muted ps-3">
                <i className="bi bi-search fs-5"></i>
              </InputGroup.Text>
              <Form.Control
                className="border-0 shadow-none py-2"
                placeholder="Search products by title, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-link text-muted pe-3 text-decoration-none"
                  onClick={() => setSearch('')}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select
              className="py-2 border rounded-3 shadow-none fw-semibold text-secondary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? '🏷️ All Categories' : `📦 ${cat}`}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filtered.map((product) => (
          <Col key={product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && !error && (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm mt-4">
          <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
          <h5>No products match your search</h5>
          <p className="text-muted">Try adjusting your keywords or category filters.</p>
        </div>
      )}
    </Container>
  );
};

export default Products;
