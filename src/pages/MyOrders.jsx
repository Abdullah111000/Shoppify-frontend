import { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert, Accordion } from 'react-bootstrap';
import { orderAPI } from '../services/apiServices';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusVariant = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Orders</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">You haven&apos;t placed any orders yet.</Alert>
      ) : (
        <Accordion>
          {orders.map((order, index) => (
            <Accordion.Item eventKey={String(index)} key={order._id}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 me-3">
                  <span>
                    Order #{order._id.slice(-8).toUpperCase()} — ${order.totalAmount.toFixed(2)}
                  </span>
                  <Badge bg={statusVariant[order.status] || 'secondary'}>{order.status}</Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
                <Table size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 40, height: 40, objectFit: 'cover' }}
                              className="rounded"
                            />
                            {item.name}
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Card className="mt-2 bg-light">
                  <Card.Body className="py-2">
                    <small>
                      <strong>Ship to:</strong> {order.shippingInfo.fullName},{' '}
                      {order.shippingInfo.address}, {order.shippingInfo.city}
                    </small>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default MyOrders;
