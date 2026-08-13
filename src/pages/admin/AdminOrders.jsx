import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Accordion, Form, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { orderAPI } from '../../services/apiServices';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data.orders);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusBadge = {
    pending: 'badge-soft-warning',
    processing: 'badge-soft-info',
    shipped: 'badge-soft-secondary',
    delivered: 'badge-soft-success',
    cancelled: 'badge-soft-danger',
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading orders...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-extrabold mb-1">Order Management</h2>
          <p className="text-muted mb-0">Total {orders.length} orders recorded in system</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-5 text-center shadow-sm border-0 rounded-4">
          <i className="bi bi-box2 fs-1 text-muted d-block mb-3"></i>
          <h5>No orders placed yet</h5>
          <p className="text-muted mb-0">When customers place orders, they will appear here.</p>
        </Card>
      ) : (
        <Accordion className="d-flex flex-column gap-3">
          {orders.map((order, index) => (
            <Accordion.Item eventKey={String(index)} key={order._id} className="border rounded-4 overflow-hidden shadow-sm">
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-primary">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="text-muted">• {order.user?.name || 'Customer'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-extrabold text-success">${order.totalAmount?.toFixed(2)}</span>
                    <span className={statusBadge[order.status] || 'badge-soft-secondary'}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="bg-light p-4">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Customer Info:</strong> {order.user?.name} ({order.user?.email})</p>
                    <p className="mb-1"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Shipping Address:</strong> {order.shippingInfo?.fullName}, {order.shippingInfo?.address}, {order.shippingInfo?.city}
                      {order.shippingInfo?.postalCode && `, ${order.shippingInfo?.postalCode}`}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3 p-3 border mb-3">
                  <h6 className="fw-bold mb-3">Ordered Items ({order.orderItems?.length})</h6>
                  <Table responsive size="sm" className="mb-0 align-middle">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((item, i) => (
                        <tr key={i}>
                          <td className="fw-semibold">{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price?.toFixed(2)}</td>
                          <td className="fw-bold text-success">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <Form.Group style={{ maxWidth: 280 }}>
                  <Form.Label className="fw-semibold">Update Order Status:</Form.Label>
                  <Form.Select
                    className="border rounded-3 shadow-none fw-semibold"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default AdminOrders;
