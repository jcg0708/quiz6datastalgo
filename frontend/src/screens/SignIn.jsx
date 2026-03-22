import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/users';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/login/`, form);
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);

      // Decode JWT to get role
      const payload = JSON.parse(atob(res.data.access.split('.')[1]));
      localStorage.setItem('userRole', payload.role);
      localStorage.setItem('userEmail', payload.email);
      localStorage.setItem('merchantId', payload.merchant_id || '');

      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h3>Sign In</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Sign In
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              No account yet? <Link to="/register">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
