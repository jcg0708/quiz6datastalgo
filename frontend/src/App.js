import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// New screens
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ApplySeller from './screens/ApplySeller';
import UserScreen from './screens/UserScreen';
import SellerDashboard from './screens/SellerDashboard';
import UserProfile from './screens/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/service/:id" element={<DetailScreen />} />
          <Route path="/apply-seller" element={<ApplySeller />} />
          <Route path="/admin/users" element={<UserScreen />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
