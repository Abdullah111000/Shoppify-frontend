import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useAuth();
  const { addToCart } = useCart();

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart');
  };

  if (wishlist.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-heart display-1 text-muted"></i>
        <h3 className="mt-3">Your wishlist is empty</h3>
        <Button as={Link} to="/products" variant="primary" className="mt-3">
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Wishlist</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {wishlist.map((product) => (
          <Col key={product._id}>
            <div className="position-relative">
              <ProductCard product={product} />
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="flex-grow-1"
                  onClick={() => handleRemove(product._id)}
                >
                  Remove
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-grow-1"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;
