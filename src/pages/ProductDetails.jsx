import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { productAPI } from '../services/apiServices';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, quantity);
    toast.success('Added to cart');
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.info('Please login to add favorites');
      return;
    }
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow" style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }} />
        </Col>
        <Col md={6}>
          <Badge bg="secondary" className="mb-2">
            {product.category}
          </Badge>
          <h1>{product.name}</h1>
          <h3 className="text-primary mb-3">${product.price.toFixed(2)}</h3>
          <p className="text-muted">{product.description}</p>
          <p>
            <strong>Stock:</strong>{' '}
            <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </Badge>
          </p>

          <div className="d-flex align-items-center gap-3 my-4">
            <div className="d-flex align-items-center border rounded">
              <Button
                variant="light"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-3">{quantity}</span>
              <Button
                variant="light"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <i className="bi bi-cart-plus me-2"></i>Add to Cart
            </Button>
            <Button variant="outline-danger" size="lg" onClick={handleFavorite}>
              <i className={`bi ${isInWishlist(product._id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
