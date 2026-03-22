import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        🌿 Arborist App
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center">
          {token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  My Profile
                </Link>
              </li>
              {role === 'Admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    Admin Panel
                  </Link>
                </li>
              )}
              {role === 'Seller' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/seller-dashboard">
                    Dashboard
                  </Link>
                </li>
              )}
              {role === 'User' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/apply-seller">
                    Become a Seller
                  </Link>
                </li>
              )}
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
