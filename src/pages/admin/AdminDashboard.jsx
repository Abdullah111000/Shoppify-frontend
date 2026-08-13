import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/apiServices';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getStats();
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
        <p className="text-muted mt-3 fw-semibold">Loading admin analytics dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: 'bi-currency-dollar', classStyle: 'stat-card-dark' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: 'bi-bag-check-fill', classStyle: 'stat-card-danger' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: 'bi-box-seam-fill', classStyle: 'stat-card-success' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: 'bi-people-fill', classStyle: 'stat-card-primary' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: 'bi-person-check-fill', classStyle: 'stat-card-info' },
    { label: 'Total Admins', value: stats?.totalAdmins || 0, icon: 'bi-shield-lock-fill', classStyle: 'stat-card-warning' },
  ];

  return (
    <Container className="py-4">
      {/* Dashboard Top Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-extrabold mb-0">Executive Admin Dashboard</h2>
            <Badge bg="warning" className="text-dark">Admin Portal</Badge>
          </div>
          <p className="text-muted mb-0">Real-time e-commerce performance overview & management</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/products" className="btn btn-gradient btn-sm px-3">
            <i className="bi bi-box-seam me-1"></i> Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-dark btn-sm px-3 rounded-3">
            <i className="bi bi-bag-check me-1"></i> Orders
          </Link>
          <Link to="/admin/users" className="btn btn-outline-dark btn-sm px-3 rounded-3">
            <i className="bi bi-people me-1"></i> Users
          </Link>
        </div>
      </div>

      {/* 6 Analytics Gradient Cards */}
      <Row className="g-3 mb-5">
        {statCards.map((card) => (
          <Col key={card.label} xs={12} sm={6} md={4} lg={2}>
            <div className={`stat-card-gradient ${card.classStyle} h-100 d-flex flex-column justify-content-between`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="small text-white text-opacity-75 font-heading text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>
                  {card.label}
                </span>
                <i className={`bi ${card.icon} stat-card-icon`}></i>
              </div>
              <div>
                <h3 className="fw-extrabold mb-0 text-white">{card.value}</h3>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Tables Row */}
      <Row className="g-4">
        <Col lg={6}>
          <Card className="custom-table-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-6 text-dark">
                <i className="bi bi-clock-history me-2 text-primary"></i>Recent Orders
              </span>
              <Link to="/admin/orders" className="small text-decoration-none fw-semibold text-primary">
                View All <i className="bi bi-chevron-right"></i>
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="custom-table mb-0">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-semibold">{order.user?.name || 'Guest'}</td>
                      <td className="fw-bold text-success">${order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`badge-soft-${order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'info' : 'warning'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!stats?.recentOrders?.length && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted">
                        No orders recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="custom-table-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-6 text-dark">
                <i className="bi bi-person-plus me-2 text-info"></i>Recent Registrations
              </span>
              <Link to="/admin/users" className="small text-decoration-none fw-semibold text-primary">
                View All <i className="bi bi-chevron-right"></i>
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="custom-table mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map((user) => (
                    <tr key={user._id}>
                      <td className="fw-semibold">{user.name}</td>
                      <td className="text-muted small">{user.email}</td>
                      <td>
                        <span className={`badge-soft-${user.role === 'admin' ? 'warning' : 'info'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!stats?.recentUsers?.length && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted">
                        No recent users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
