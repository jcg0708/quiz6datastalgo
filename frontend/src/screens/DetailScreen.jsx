import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const API_SERVICES = 'http://localhost:8000/api/v1/services';
const API_ORDERS = 'http://localhost:8000/api/v1/orders';

// Replace with your platform PayPal client-id
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'AY_Cs_wAqI__TxlTPzBpimvBryreibaanNngcAXf1hVMVI1e1OGjjtNuSVJnUsqzNweUphsHaUf8S7ly';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= stars ? '#ffc107' : '#ddd', fontSize: 22 }}>
          ★
        </span>
      ))}
      <small className="text-muted ms-1">({rating.toFixed(1)})</small>
    </span>
  );
};

const DetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(`${API_SERVICES}/${id}/`)
      .then((res) => setService(res.data))
      .catch(() => setError('Service not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const transactionId = details.id;

      await axios.post(
        `${API_ORDERS}/create/`,
        {
          service: service.id,
          paypal_transaction_id: transactionId,
          price_paid: service.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderSuccess(true);
    } catch (err) {
      alert('Payment captured but failed to record order. Please contact support.');
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

  if (!service) return null;

  // Determine seller's PayPal merchant ID
  const sellerMerchantId = service.seller_merchant_id || null;

  const paypalOptions = {
    'client-id': PAYPAL_CLIENT_ID,
    currency: 'USD',
    ...(sellerMerchantId ? { 'merchant-id': sellerMerchantId } : {}),
  };

  return (
    <div className="container mt-5 mb-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row">
        <div className="col-md-6">
          {service.sample_image_url ? (
            <img
              src={service.sample_image_url}
              alt={service.service_name}
              className="img-fluid rounded shadow"
              style={{ maxHeight: 400, width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="bg-secondary rounded d-flex align-items-center justify-content-center"
              style={{ height: 400 }}
            >
              <span className="text-white fs-1">🌿</span>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h2>{service.service_name}</h2>
          <p className="text-muted">{service.description}</p>

          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <strong>Rating:</strong> <StarRating rating={service.rating} />
            </li>
            <li className="list-group-item">
              <strong>Price:</strong>{' '}
              <span className="text-success fs-5">
                ${parseFloat(service.price).toFixed(2)}
              </span>
            </li>
            <li className="list-group-item">
              <strong>Duration:</strong> {service.duration_of_service}
            </li>
            <li className="list-group-item">
              <strong>Expert:</strong> {service.name_of_the_expert}
            </li>
          </ul>

          {orderSuccess ? (
            <div className="alert alert-success">
              🎉 Payment successful! Your order has been recorded!
            </div>
          ) : token ? (
            <div>
              <h5 className="mb-3">Pay with PayPal</h5>
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [
                        {
                          description: service.service_name,
                          amount: { value: parseFloat(service.price).toFixed(2) },
                          ...(sellerMerchantId
                            ? { payee: { merchant_id: sellerMerchantId } }
                            : {}),
                        },
                      ],
                    })
                  }
                  onApprove={handleApprove}
                  onError={(err) => alert('PayPal error: ' + err)}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="alert alert-warning">
              Please <a href="/login">sign in</a> to purchase this service.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
