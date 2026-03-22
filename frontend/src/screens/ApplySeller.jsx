import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/applications';

const ApplySeller = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const handleApply = async () => {
    setError('');
    try {
      await axios.post(
        `${API}/apply/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to submit application. You may have already applied.'
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark text-center">
              <h3>Apply as a Seller</h3>
            </div>
            <div className="card-body text-center">
              {submitted ? (
                <div>
                  <div className="alert alert-success">
                    🎉 Your application has been submitted! An admin will review it shortly.
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go to Home
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    Want to offer your services on our platform? Click below to apply as a
                    seller. Your application will be reviewed by an admin.
                  </p>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button className="btn btn-warning btn-lg" onClick={handleApply}>
                    Submit Application
                  </button>
                </div>
              )}
            </div>
            <div className="card-footer text-center">
              <button
                className="btn btn-link"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplySeller;
