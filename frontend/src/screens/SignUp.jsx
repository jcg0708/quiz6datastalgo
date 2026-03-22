import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/users';

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    location: '',
    gender: 'Male',
    password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (form.password !== form.confirm_password) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`${API}/register/`, form);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setIsError(true);
      const data = err.response?.data || {};
      const firstError = Object.values(data)[0];
      setMessage(
        Array.isArray(firstError)
          ? firstError[0]
          : JSON.stringify(data)
      );
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow">
            <div className="card-header text-center bg-success text-white">
              <h3>Create an Account</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

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
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="+63 900 000 0000"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, Province"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Create Account
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              Already have an account? <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
