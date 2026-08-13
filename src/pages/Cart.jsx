import { Link } from 'react-router-dom';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemsCount } = useCart();

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h3 className="mt-3">Your cart is empty</h3>
        <Button as={Link} to="/products" variant="primary" className="mt-3">
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                    className="rounded"
                  />
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <Badge bg="secondary">{item.category}</Badge>
                  </div>
                </div>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center border rounded" style={{ width: 'fit-content' }}>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-3">{item.quantity}</span>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item._id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end">
        <div className="border rounded p-4" style={{ minWidth: 300 }}>
          <div className="d-flex justify-content-between mb-2">
            <span>Total Items:</span>
            <strong>{cartItemsCount}</strong>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Subtotal:</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-3 fs-5">
            <span>Total:</span>
            <strong className="text-primary">${cartTotal.toFixed(2)}</strong>
          </div>
          <Button as={Link} to="/checkout" variant="primary" className="w-100" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
