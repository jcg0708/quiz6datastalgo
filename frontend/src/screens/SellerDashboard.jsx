import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/services';
const MEDIA = 'http://localhost:8000';

const SellerDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_of_service: '',
    sample_image: null,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'Seller' && role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/manage/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch {
      setError('Unable to load your services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      service_name: '',
      description: '',
      price: '',
      duration_of_service: '',
      sample_image: null,
    });
    setFormError('');
    setFormSuccess('');
    setEditService(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (svc) => {
    setEditService(svc);
    setForm({
      service_name: svc.service_name,
      description: svc.description,
      price: svc.price,
      duration_of_service: svc.duration_of_service,
      sample_image: null,
    });
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setForm({ ...form, sample_image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const data = new FormData();
    data.append('service_name', form.service_name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('duration_of_service', form.duration_of_service);
    if (form.sample_image) {
      data.append('sample_image', form.sample_image);
    }

    try {
      if (editService) {
        await axios.patch(`${API}/manage/${editService.id}/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormSuccess('Service updated!');
      } else {
        await axios.post(`${API}/manage/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormSuccess('Service added!');
      }
      fetchServices();
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      setFormError(data ? JSON.stringify(data) : 'Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${API}/manage/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch {
      alert('Failed to delete service.');
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seller Dashboard</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Service
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            {editService ? 'Edit Service' : 'Add New Service'}
          </div>
          <div className="card-body">
            {formError && <div className="alert alert-danger">{formError}</div>}
            {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  name="service_name"
                  className="form-control"
                  value={form.service_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (USD)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Duration of Service</label>
                  <input
                    type="text"
                    name="duration_of_service"
                    className="form-control"
                    placeholder="e.g. 2 hours"
                    value={form.duration_of_service}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Service Image {editService && '(leave blank to keep existing)'}
                </label>
                <input
                  type="file"
                  name="sample_image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editService ? 'Update Service' : 'Add Service'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Services Table ── */}
      {services.length === 0 ? (
        <p className="text-muted">You haven't added any services yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id}>
                  <td>
                    {svc.sample_image_url ? (
                      <img
                        src={svc.sample_image_url}
                        alt={svc.service_name}
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{svc.service_name}</td>
                  <td>${parseFloat(svc.price).toFixed(2)}</td>
                  <td>{svc.duration_of_service}</td>
                  <td>{svc.rating.toFixed(1)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(svc)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(svc.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
