import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Modal, Button, Form, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/apiServices';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await userAPI.getAll();
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await userAPI.updateRole(userId, role);
      toast.success('User role updated successfully');
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(userId);
      toast.success('User deleted');
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading user accounts...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-extrabold mb-1">User Management</h2>
          <p className="text-muted mb-0">Total <strong>{users.length}</strong> registered user accounts</p>
        </div>
      </div>

      <Card className="custom-table-card">
        <Card.Body className="p-0">
          <Table responsive className="custom-table mb-0 align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge-soft-${u.role === 'admin' ? 'warning' : 'info'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" className="rounded-3" onClick={() => { setSelected(u); setShowModal(true); }}>
                      <i className="bi bi-eye me-1"></i> View & Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="rounded-4">
        <Modal.Header closeButton className="border-bottom bg-light">
          <Modal.Title className="fw-bold">
            <i className="bi bi-person-gear me-2 text-primary"></i>User Account Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selected && (
            <>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 48, height: 48 }}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="fw-bold mb-0">{selected.name}</h5>
                  <small className="text-muted">{selected.email}</small>
                </div>
              </div>

              <p className="mb-2"><strong>Role:</strong> <span className={`badge-soft-${selected.role === 'admin' ? 'warning' : 'info'} ms-2`}>{selected.role}</span></p>
              <p className="mb-3"><strong>Registered:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
              
              <Form.Group className="mt-4 pt-3 border-top">
                <Form.Label className="fw-semibold mb-2">Change Role:</Form.Label>
                <div className="d-flex gap-2">
                  <Button
                    variant={selected.role === 'customer' ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="rounded-3 flex-grow-1"
                    onClick={() => handleRoleChange(selected._id, 'customer')}
                  >
                    Customer Role
                  </Button>
                  <Button
                    variant={selected.role === 'admin' ? 'warning' : 'outline-warning'}
                    size="sm"
                    className="rounded-3 flex-grow-1"
                    onClick={() => handleRoleChange(selected._id, 'admin')}
                  >
                    Admin Role
                  </Button>
                </div>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top bg-light justify-content-between">
          {selected && (
            <Button variant="outline-danger" size="sm" className="rounded-3" onClick={() => handleDelete(selected._id)}>
              <i className="bi bi-trash me-1"></i> Delete User
            </Button>
          )}
          <Button variant="secondary" size="sm" className="rounded-3" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;
