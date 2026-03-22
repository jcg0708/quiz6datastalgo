import { useEffect, useState } from 'react';
import axios from 'axios';

const API_USERS = 'http://localhost:8000/api/v1/users';
const API_ORDERS = 'http://localhost:8000/api/v1/orders';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveMsg, setSaveMsg] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_USERS}/profile/`, { headers }),
      axios.get(`${API_ORDERS}/history/`, { headers }),
    ])
      .then(([profileRes, ordersRes]) => {
        setProfile(profileRes.data);
        setEditForm(profileRes.data);
        setOrders(ordersRes.data);
      })
      .catch(() => setError('Unable to load your profile. Please refresh the page or contact support.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaveMsg('');
    try {
      const res = await axios.patch(`${API_USERS}/profile/`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEditMode(false);
      setSaveMsg('Profile updated successfully!');
    } catch {
      setSaveMsg('Failed to update profile.');
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">My Profile</h2>

      {saveMsg && (
        <div
          className={`alert ${saveMsg.includes('success') ? 'alert-success' : 'alert-danger'}`}
        >
          {saveMsg}
        </div>
      )}

      {/* ── Profile Card ── */}
      <div className="card shadow mb-5">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">User Information</h5>
          {!editMode && (
            <button
              className="btn btn-light btn-sm"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="card-body">
          {editMode ? (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  name="first_name"
                  value={editForm.first_name || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  name="last_name"
                  value={editForm.last_name || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-control"
                  name="phone_number"
                  value={editForm.phone_number || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  name="location"
                  value={editForm.location || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-success" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setEditForm(profile);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Name:</strong> {profile.first_name} {profile.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Phone:</strong> {profile.phone_number || '—'}
                </p>
                <p>
                  <strong>Location:</strong> {profile.location || '—'}
                </p>
                <p>
                  <strong>Gender:</strong> {profile.gender || '—'}
                </p>
                <p>
                  <strong>Role:</strong>{' '}
                  <span
                    className={`badge ${
                      profile.role === 'Admin'
                        ? 'bg-danger'
                        : profile.role === 'Seller'
                        ? 'bg-success'
                        : 'bg-secondary'
                    }`}
                  >
                    {profile.role}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Order History ── */}
      <h4 className="mb-3">Order History</h4>
      {orders.length === 0 ? (
        <p className="text-muted">You haven't placed any orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Seller</th>
                <th>Amount Paid</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.service_name}</td>
                  <td>{order.seller_name}</td>
                  <td>${parseFloat(order.price_paid).toFixed(2)}</td>
                  <td>
                    <small className="text-muted">{order.paypal_transaction_id || '—'}</small>
                  </td>
                  <td>{new Date(order.date_purchased).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
