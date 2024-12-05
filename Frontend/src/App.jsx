import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage.jsx';
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx';
import HostelerLogin from './Pages/HostelerLogin/HostelerLogin.jsx';
import WardenDashboard from './Pages/WardenDashboard/WardenDashboard.jsx';
import ProfilePage from './Pages/Profile/ProfilePage.jsx';
import UploadMessMenu from './Pages/WardenDashboard/UploadMessMenu.jsx';
import ViewMessMenu from './Pages/HostelerDashboard/ViewMessMenu.jsx';
import HostelerDashboard from './Pages/HostelerDashboard/HostelerDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/hosteler-login" element={<HostelerLogin />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/hosteler-dashboard" element={<HostelerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upload-mess-menu" element={<UploadMessMenu />} />
        <Route path="/view-mess-menu" element={<ViewMessMenu />} />
      </Routes>
    </Router>
  );
}

export default App;
