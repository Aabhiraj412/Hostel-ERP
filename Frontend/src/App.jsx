import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage.jsx';
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx';
import HostelerLogin from './Pages/HostelerLogin/HostelerLogin.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/hosteler-login" element={<HostelerLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
