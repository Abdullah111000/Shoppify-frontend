import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin, wishlist } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" className="custom-navbar shadow-sm">
      <Container fluid="xl">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4 text-decoration-none">
          <div className="brand-icon-bg me-2 d-flex align-items-center justify-content-center">
            <i className="bi bi-bag-heart-fill text-white fs-6"></i>
          </div>
          <span className="brand-gradient">Shoppify</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" className="border-0 text-light shadow-none p-1">
          <i className="bi bi-list fs-2 text-light"></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-nav" className="mt-3 mt-lg-0">
          <Nav className="me-auto ms-lg-2 gap-1 align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end className="custom-nav-link">
              <i className="bi bi-grid-fill"></i>
              <span>Home</span>
            </Nav.Link>

            <Nav.Link as={NavLink} to="/products" className="custom-nav-link">
              <i className="bi bi-shop"></i>
              <span>Shop Products</span>
            </Nav.Link>

            {user && !isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/dashboard" className="custom-nav-link">
                  <i className="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/my-orders" className="custom-nav-link">
                  <i className="bi bi-box-seam"></i>
                  <span>My Orders</span>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/wishlist" className="custom-nav-link">
                  <i className="bi bi-heart"></i>
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <Badge bg="danger" pill className="ms-1 px-2 py-1">
                      {wishlist.length}
                    </Badge>
                  )}
                </Nav.Link>
              </>
            )}

            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin" className="custom-nav-link text-warning">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Admin Panel</span>
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center gap-2 mt-3 mt-lg-0">
            <Nav.Link as={NavLink} to="/cart" className="nav-cart-btn">
              <i className="bi bi-cart3 fs-6 text-warning"></i>
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <Badge bg="danger" pill className="px-2 py-1">
                  {cartItemsCount}
                </Badge>
              )}
            </Nav.Link>

            {user ? (
              <div className="d-flex align-items-center gap-2">
                <div className="user-profile-pill d-flex align-items-center gap-2">
                  <div className="user-avatar-circle">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="d-flex align-items-center gap-1.5">
                    <span className="small fw-semibold text-light">{user.name}</span>
                    <Badge bg={isAdmin ? 'warning' : 'info'} text={isAdmin ? 'dark' : 'white'} className="ms-1 font-monospace" style={{ fontSize: '0.7rem' }}>
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <button onClick={handleLogout} className="btn-logout" title="Logout">
                  <i className="bi bi-box-arrow-right fs-6"></i>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Nav.Link as={NavLink} to="/login" className="btn-nav-login">
                  <i className="bi bi-box-arrow-in-right"></i> Log In
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="btn-nav-signup">
                  <i className="bi bi-person-plus"></i> Sign Up
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
