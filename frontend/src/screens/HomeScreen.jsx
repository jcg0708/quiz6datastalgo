import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000/api/v1/services';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= stars ? '#ffc107' : '#ddd' }}>
          ★
        </span>
      ))}
      <small className="text-muted ms-1">({rating.toFixed(1)})</small>
    </span>
  );
};

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/list/`)
      .then((res) => setServices(res.data))
      .catch(() => setError('Failed to load services.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading services…</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Services</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {services.length === 0 && !error && (
        <p className="text-center text-muted">No services available yet.</p>
      )}

      <div className="row g-4">
        {services.map((service) => (
          <div className="col-sm-6 col-lg-4" key={service.id}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/service/${service.id}`)}
            >
              {service.sample_image_url ? (
                <img
                  src={service.sample_image_url}
                  alt={service.service_name}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                  style={{ height: 200 }}
                >
                  <span className="text-white fs-1">🌿</span>
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{service.service_name}</h5>
                <p className="card-text text-muted flex-grow-1">
                  {service.description.length > 100
                    ? service.description.substring(0, 100) + '…'
                    : service.description}
                </p>
                <div className="mt-2">
                  <StarRating rating={service.rating} />
                </div>
              </div>
              <div className="card-footer text-end">
                <Link
                  to={`/service/${service.id}`}
                  className="btn btn-sm btn-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
