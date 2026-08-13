import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { wishlistAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, wishlistItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await wishlistAPI.getDashboard();
        setStats(data.stats);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* Welcome Banner */}
      <div className="bg-white rounded-4 p-4 p-md-5 border shadow-sm mb-4 position-relative overflow-hidden">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 56, height: 56 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="fw-extrabold mb-0">Welcome back, {user?.name}!</h2>
            <p className="text-muted mb-0">Manage your orders, saved items and account overview</p>
          </div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100 border-0 rounded-4 shadow-sm p-3 bg-white border">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
                <i className="bi bi-bag-check-fill fs-1"></i>
              </div>
              <h2 className="fw-extrabold mb-1">{stats.totalOrders}</h2>
              <p className="text-muted mb-3">Total Orders Placed</p>
              <Link to="/my-orders" className="btn btn-gradient btn-sm px-4 mt-auto">
                View Orders History
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 rounded-4 shadow-sm p-3 bg-white border">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-circle mb-3">
                <i className="bi bi-heart-fill fs-1"></i>
              </div>
              <h2 className="fw-extrabold mb-1">{stats.wishlistItems}</h2>
              <p className="text-muted mb-3">Items Saved in Wishlist</p>
              <Link to="/wishlist" className="btn btn-gradient-secondary btn-sm px-4 mt-auto">
                View My Wishlist
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 rounded-4 shadow-sm p-3 bg-white border">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle mb-3">
                <i className="bi bi-person-badge-fill fs-1"></i>
              </div>
              <h5 className="fw-bold mb-1">{user?.name}</h5>
              <p className="text-muted small mb-2">{user?.email}</p>
              <Badge bg="info" className="px-3 py-1 text-uppercase">
                {user?.role} Account
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;
