import { Link, useParams } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <Container className="py-5 text-center" style={{ maxWidth: 600 }}>
      <Card className="shadow border-success">
        <Card.Body className="p-5">
          <i className="bi bi-check-circle-fill text-success display-1"></i>
          <h2 className="mt-3">Order Placed Successfully!</h2>
          <Alert variant="success" className="mt-3">
            Your order ID: <strong>{id}</strong>
          </Alert>
          <p className="text-muted">Thank you for your purchase. You can track your order in My Orders.</p>
          <div className="d-flex gap-3 justify-content-center mt-4">
            <Button as={Link} to="/my-orders" variant="primary">
              View My Orders
            </Button>
            <Button as={Link} to="/products" variant="outline-primary">
              Continue Shopping
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccess;
