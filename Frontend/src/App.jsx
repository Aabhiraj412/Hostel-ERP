import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage.jsx';
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx';
import HostelerLogin from './Pages/HostelerLogin/HostelerLogin.jsx';
import WardenDashboard from './Pages/WardenDashboard/WardenDashboard.jsx';
import ProfilePageHosteler from './Pages/Profile/ProfilePageHosteler.jsx';
import ProfilePageWarden from './Pages/Profile/ProfilePageWarden.jsx';
import UploadMessMenu from './Pages/WardenDashboard/UploadMessMenu.jsx';
import ViewMessMenu from './Pages/HostelerDashboard/ViewMessMenu.jsx';
import HostelerDashboard from './Pages/HostelerDashboard/HostelerDashboard.jsx';
import PublishNotice from './Pages/WardenDashboard/PublishNotice.jsx';
import ViewNotice from './Pages/HostelerDashboard/ViewNotice.jsx';
import PublicGrievances from './Pages/HostelerDashboard/PublicGrievances.jsx';
import PrivateGrievances from './Pages/HostelerDashboard/PrivateGrievances.jsx';
import ViewPublicGrievances from './Pages/WardenDashboard/ViewPublicGrievances.jsx';
import ViewPrivateGrievances from './Pages/WardenDashboard/ViewPrivateGrievances.jsx';
import OutRegister from './Pages/HostelerDashboard/OutRegister.jsx';
import ViewOutRegister from './Pages/WardenDashboard/ViewOutRegister.jsx';
import ApplyLeave from './Pages/HostelerDashboard/ApplyLeave.jsx';
import ViewLeaves from './Pages/WardenDashboard/ViewLeaves.jsx'; 
import ViewHosteler from './Pages/WardenDashboard/ViewHosteler.jsx';
import AddHosteler from './Pages/WardenDashboard/AddHosteler.jsx';
import FetchAttendance from './Pages/WardenDashboard/FetchAttendance.jsx';
import AddDetails from './Pages/HostelerDashboard/AddDetails.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/hosteler-login" element={<HostelerLogin />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/hosteler-dashboard" element={<HostelerDashboard />} />
        <Route path="/profile-hosteler" element={<ProfilePageHosteler />} />
        <Route path="/profile-warden" element={<ProfilePageWarden />} />
        <Route path="/upload-mess-menu" element={<UploadMessMenu />} />
        <Route path="/view-mess-menu" element={<ViewMessMenu />} />
        <Route path="/publish-notice" element={<PublishNotice />} />
        <Route path="/view-notice" element={<ViewNotice />} />
        <Route path="/private-grievance" element={<PrivateGrievances />} />
        <Route path="/public-grievance" element={<PublicGrievances />} />
        <Route path="/view-private-grievance" element={<ViewPrivateGrievances />} />
        <Route path="/view-public-grievance" element={<ViewPublicGrievances />} />
        <Route path="/out-register" element={<OutRegister />} />
        <Route path="/view-out-register" element={<ViewOutRegister />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/view-leave" element={<ViewLeaves />} />
        <Route path="/view-hosteler" element={<ViewHosteler />} />
        <Route path="/add-hosteler" element={<AddHosteler />} />
        <Route path="/fetch-attendance" element={<FetchAttendance />} />
        <Route path="/add-details" element={<AddDetails />} />
      </Routes>
    </Router>
  );
}

export default App;



