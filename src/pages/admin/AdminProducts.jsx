import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Spinner, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { productAPI } from '../../services/apiServices';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '', price: '', stock: '', imageUrl: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.image,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    if (imageFile) formData.append('image', imageFile);
    else if (form.imageUrl) formData.append('imageUrl', form.imageUrl);

    try {
      if (editing) {
        await productAPI.update(editing._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(formData);
        toast.success('Product created successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted mt-3 fw-semibold">Loading product management...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-extrabold mb-1">Product Management</h2>
          <p className="text-muted mb-0">Total {products.length} products available in store catalog</p>
        </div>
        <Button className="btn-gradient px-4 py-2 d-flex align-items-center gap-2" onClick={openCreate}>
          <i className="bi bi-plus-circle-fill fs-5"></i> Add New Product
        </Button>
      </div>

      <Card className="custom-table-card">
        <Card.Body className="p-0">
          <Table responsive className="custom-table mb-0 align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      style={{ width: 48, height: 48, objectFit: 'cover' }}
                      className="rounded-3 border shadow-sm"
                    />
                  </td>
                  <td className="fw-bold">{product.name}</td>
                  <td>
                    <span className="badge-soft-info">{product.category}</span>
                  </td>
                  <td className="fw-bold text-success">${product.price?.toFixed(2)}</td>
                  <td>
                    <span className={`badge-soft-${product.stock > 0 ? 'success' : 'danger'}`}>
                      {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="text-muted small">{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Button variant="outline-primary" size="sm" className="rounded-3" onClick={() => openEdit(product)}>
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-3" onClick={() => handleDelete(product._id)}>
                        <i className="bi bi-trash me-1"></i> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No products added yet. Click "Add New Product" to add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="rounded-4">
        <Modal.Header closeButton className="border-bottom bg-light">
          <Modal.Title className="fw-bold">
            <i className="bi bi-box-seam me-2 text-primary"></i>
            {editing ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Product Name *</Form.Label>
                  <Form.Control
                    required
                    placeholder="e.g. Wireless Headphones"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Category *</Form.Label>
                  <Form.Control
                    required
                    placeholder="e.g. Electronics, Fashion, Home"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description *</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder="High quality product details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Price ($) *</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="29.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Stock Quantity *</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    min="0"
                    placeholder="100"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Upload Image File (Cloudinary / Fallback)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Or Provide Image URL</Form.Label>
              <Form.Control
                placeholder="https://images.unsplash.com/photo-..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top bg-light">
            <Button variant="light" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient px-4" disabled={submitting}>
              {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
