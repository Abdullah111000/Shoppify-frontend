import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.info('Please login to add favorites');
      return;
    }
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const shortDesc =
    product.description?.length > 75
      ? `${product.description.substring(0, 75)}...`
      : product.description;

  const inStock = product.stock > 0;

  return (
    <Card className="h-100 product-card">
      <div className="product-img-wrapper">
        <Card.Img
          variant="top"
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="product-card-img"
        />
        <button
          className="wishlist-btn-floating"
          onClick={handleFavorite}
          title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`bi ${isInWishlist(product._id) ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`}></i>
        </button>

        <div className="position-absolute bottom-0 start-0 m-2">
          {inStock ? (
            <span className="badge badge-soft-success shadow-sm">
              <i className="bi bi-check-circle-fill me-1"></i>In Stock ({product.stock})
            </span>
          ) : (
            <span className="badge badge-soft-danger shadow-sm">
              <i className="bi bi-x-circle-fill me-1"></i>Out of Stock
            </span>
          )}
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge badge-soft-info text-uppercase" style={{ fontSize: '0.7rem' }}>
            {product.category}
          </span>
        </div>

        <Card.Title className="fw-bold fs-6 mb-2 text-truncate" title={product.name}>
          {product.name}
        </Card.Title>

        <Card.Text className="text-muted small flex-grow-1 mb-3" style={{ lineHeight: '1.4' }}>
          {shortDesc}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-end mt-auto pt-2 border-top">
          <div>
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Price</small>
            <span className="price-tag">${product.price?.toFixed(2)}</span>
          </div>

          <div className="d-flex gap-1.5">
            <Button
              as={Link}
              to={`/products/${product._id}`}
              variant="light"
              size="sm"
              className="rounded-3 border px-2 py-1"
              title="View Details"
            >
              <i className="bi bi-eye text-secondary"></i>
            </Button>

            <Button
              className="btn-gradient btn-sm px-3 py-1 d-flex align-items-center gap-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <i className="bi bi-bag-plus"></i> Add
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
