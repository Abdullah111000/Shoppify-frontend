import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/apiServices';

const Checkout = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { cart, cartTotal, cartItemsCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    orderNotes: '',
  });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLogin(false);
      setShipping((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleCheckoutLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await login(loginForm);
      toast.success('Login successful! You can now complete your order.');
      setShowLogin(false);
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setPlacing(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const { data } = await orderAPI.create({
        orderItems,
        shippingInfo: shipping,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const formDisabled = !isAuthenticated;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Checkout</h2>

      {showLogin && (
        <Card className="mb-4 border-warning">
          <Card.Header className="bg-warning bg-opacity-25">
            <strong>Login to complete your order</strong>
          </Card.Header>
          <Card.Body>
            {loginError && <Alert variant="danger">{loginError}</Alert>}
            <Form onSubmit={handleCheckoutLogin}>
              <Row>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loginLoading}>
                    {loginLoading ? '...' : 'Login'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Row className="g-4">
        <Col lg={7}>
          <Card className={formDisabled ? 'opacity-50' : ''}>
            <Card.Header>
              <strong>Shipping Information</strong>
            </Card.Header>
            <Card.Body>
              <fieldset disabled={formDisabled}>
                <Form onSubmit={handlePlaceOrder}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          required
                          value={shipping.fullName}
                          onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          required
                          value={shipping.email}
                          onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Shipping Address *</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      rows={2}
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          required
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          value={shipping.postalCode}
                          onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4">
                    <Form.Label>Order Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={shipping.orderNotes}
                      onChange={(e) => setShipping({ ...shipping, orderNotes: e.target.value })}
                    />
                  </Form.Group>
                  <Button type="submit" variant="success" size="lg" disabled={formDisabled || placing}>
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </Form>
              </fieldset>
              {formDisabled && (
                <Alert variant="info" className="mt-3 mb-0">
                  Please login above to enable the checkout form.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card>
            <Card.Header>
              <strong>Order Summary</strong>
            </Card.Header>
            <Card.Body>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>{cartItemsCount}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total:</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
