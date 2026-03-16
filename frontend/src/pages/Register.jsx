import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: '',
    location: '', gender: 'Male', password: '', confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      setMessage('✅ Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.username?.[0] || err.response?.data?.detail || 'Something went wrong'));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center bg-success text-white">
              <h3>Register - Arborist App</h3>
            </div>
            <div className="card-body">
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3"><input type="text" name="username" placeholder="Username" className="form-control" onChange={handleChange} required /></div>
                  <div className="col-md-6 mb-3"><input type="email" name="email" placeholder="Email" className="form-control" onChange={handleChange} required /></div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3"><input type="text" name="first_name" placeholder="First Name" className="form-control" onChange={handleChange} required /></div>
                  <div className="col-md-6 mb-3"><input type="text" name="last_name" placeholder="Last Name" className="form-control" onChange={handleChange} required /></div>
                </div>
                <div className="mb-3"><input type="text" name="phone" placeholder="Phone Number" className="form-control" onChange={handleChange} required /></div>
                <div className="mb-3"><input type="text" name="location" placeholder="Location (e.g. Angeles City)" className="form-control" onChange={handleChange} required /></div>
                
                <div className="mb-3">
                  <select name="gender" className="form-select" onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3"><input type="password" name="password" placeholder="Password" className="form-control" onChange={handleChange} required /></div>
                  <div className="col-md-6 mb-3"><input type="password" name="confirm_password" placeholder="Confirm Password" className="form-control" onChange={handleChange} required /></div>
                </div>

                <button type="submit" className="btn btn-success w-100">Create Account</button>
              </form>
            </div>
            <div className="card-footer text-center">
              Already have an account? <a href="/login">Login here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;