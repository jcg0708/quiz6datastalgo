import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_USERS = 'http://localhost:8000/api/v1/users';
const API_APPS = 'http://localhost:8000/api/v1/applications';

const UserScreen = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit modal state
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Decline modal state
  const [declineApp, setDeclineApp] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // Approve modal state
  const [approveApp, setApproveApp] = useState(null);
  const [merchantId, setMerchantId] = useState('');

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [usersRes, appsRes] = await Promise.all([
        axios.get(`${API_USERS}/admin/users/`, { headers }),
        axios.get(`${API_APPS}/list/`, { headers }),
      ]);
      setUsers(usersRes.data);
      setApplications(appsRes.data);
    } catch {
      setError('Failed to load users and applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Users tab ──────────────────────────────────────────
  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleEditSave = async () => {
    try {
      await axios.patch(`${API_USERS}/admin/users/${editUser.id}/`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditUser(null);
      fetchData();
    } catch {
      alert('Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_USERS}/admin/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      alert('Failed to delete user.');
    }
  };

  // ── Applications tab ───────────────────────────────────
  const openApprove = (app) => {
    setApproveApp(app);
    setMerchantId('');
  };

  const handleApprove = async () => {
    try {
      await axios.post(
        `${API_APPS}/${approveApp.id}/approve/`,
        { merchant_id: merchantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApproveApp(null);
      fetchData();
    } catch {
      alert('Failed to approve application.');
    }
  };

  const openDecline = (app) => {
    setDeclineApp(app);
    setDeclineReason('');
  };

  const handleDecline = async () => {
    try {
      await axios.post(
        `${API_APPS}/${declineApp.id}/decline/`,
        { decline_reason: declineReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeclineApp(null);
      fetchData();
    } catch {
      alert('Failed to decline application.');
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
      <h2 className="mb-4">Admin Panel</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Seller Applications
          </button>
        </li>
      </ul>

      {/* ── Users Table ── */}
      {activeTab === 'users' && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.first_name}</td>
                    <td>{u.last_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'Admin'
                            ? 'bg-danger'
                            : u.role === 'Seller'
                            ? 'bg-success'
                            : 'bg-secondary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Applications Table ── */}
      {activeTab === 'applications' && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Applicant</th>
                <th>Email</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      {app.user_first_name} {app.user_last_name}
                    </td>
                    <td>{app.user_email}</td>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === 'approved'
                            ? 'bg-success'
                            : app.status === 'declined'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => openApprove(app)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => openDecline(app)}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {app.status !== 'pending' && (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button className="btn-close" onClick={() => setEditUser(null)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleEditSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Approve Modal ── */}
      {approveApp && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve Seller Application</h5>
                <button className="btn-close" onClick={() => setApproveApp(null)} />
              </div>
              <div className="modal-body">
                <p>
                  Approving <strong>{approveApp.user_first_name} {approveApp.user_last_name}</strong> as a seller.
                </p>
                <div className="mb-3">
                  <label className="form-label">Assign Merchant ID</label>
                  <input
                    className="form-control"
                    placeholder="PayPal Merchant ID"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setApproveApp(null)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleApprove}>
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Decline Modal ── */}
      {declineApp && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Decline Application</h5>
                <button className="btn-close" onClick={() => setDeclineApp(null)} />
              </div>
              <div className="modal-body">
                <p>
                  Please provide a reason for declining{' '}
                  <strong>
                    {declineApp.user_first_name} {declineApp.user_last_name}
                  </strong>
                  's application.
                </p>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Reason for declining…"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeclineApp(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDecline}>
                  Decline Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserScreen;
