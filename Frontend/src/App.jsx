import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import AdminLogin from "./Pages/AdminLogin/AdminLogin.jsx";
import HostelerLogin from "./Pages/HostelerLogin/HostelerLogin.jsx";
import WardenDashboard from "./Pages/WardenDashboard/WardenDashboard.jsx";
import ProfilePageHosteler from "./Pages/Profile/ProfilePageHosteler.jsx";
import ProfilePageWarden from "./Pages/Profile/ProfilePageWarden.jsx";
import UploadMessMenu from "./Pages/WardenDashboard/UploadMessMenu.jsx";
import ViewMessMenu from "./Pages/HostelerDashboard/ViewMessMenu.jsx";
import HostelerDashboard from "./Pages/HostelerDashboard/HostelerDashboard.jsx";
import PublishNotice from "./Pages/WardenDashboard/PublishNotice.jsx";
import ViewNotice from "./Pages/HostelerDashboard/ViewNotice.jsx";
import PublicGrievances from "./Pages/HostelerDashboard/PublicGrievances.jsx";
import PrivateGrievances from "./Pages/HostelerDashboard/PrivateGrievances.jsx";
import ViewPublicGrievances from "./Pages/WardenDashboard/ViewPublicGrievances.jsx";
import ViewPrivateGrievances from "./Pages/WardenDashboard/ViewPrivateGrievances.jsx";
import OutRegister from "./Pages/HostelerDashboard/OutRegister.jsx";
import ViewOutRegister from "./Pages/WardenDashboard/ViewOutRegister.jsx";
import ApplyLeave from "./Pages/HostelerDashboard/ApplyLeave.jsx";
import ViewLeaves from "./Pages/WardenDashboard/ViewLeaves.jsx";
import ViewHosteler from "./Pages/WardenDashboard/ViewHosteler.jsx";
import AddHosteler from "./Pages/WardenDashboard/AddHosteler.jsx";
import FetchAttendance from "./Pages/WardenDashboard/FetchAttendance.jsx";
import AddDetails from "./Pages/HostelerDashboard/AddDetails.jsx";
import "./index.css";

import useStore from "../Store/Store.js";
import { useEffect } from "react";
function App() {
	const { setLocalhost, localhost, setTestLocalhost, testlocalhost, user } =
		useStore();

	useEffect(() => {
		const hostname = window.location.hostname;
		setLocalhost(`https://hostel-erp-9w6h.onrender.com`);
		// setLocalhost(`http://${hostname}:3000`);
		setTestLocalhost(hostname);
		// console.log(localhost);
		// console.log("TestLocalHost: ", testlocalhost);
	}, [localhost, setLocalhost, setTestLocalhost, testlocalhost]);

	return (
		// <Router>
		<Routes>
			<Route
				path="/"
				element={
					user === "Warden" ? (
						<Navigate to="/warden-dashboard" replace />
					) : user === "Hostler" ? (
						<Navigate to="/hosteler-dashboard" replace />
					) : (
						<HomePage />
					)
				}
			/>

			<Route
				path="/admin-login"
				element={
					user === "Warden" ? (
						<Navigate to="/warden-dashboard" replace />
					) : (
						<AdminLogin />
					)
				}
			/>
			<Route
				path="/warden-dashboard"
				element={
					user === "Warden" ? (
						<WardenDashboard />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/profile-warden"
				element={
					user === "Warden" ? (
						<ProfilePageWarden />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/upload-mess-menu"
				element={
					user === "Warden" ? (
						<UploadMessMenu />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/publish-notice"
				element={
					user === "Warden" ? (
						<PublishNotice />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-leave"
				element={
					user === "Warden" ? (
						<ViewLeaves />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-out-register"
				element={
					user === "Warden" ? (
						<ViewOutRegister />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-hosteler"
				element={
					user === "Warden" ? (
						<ViewHosteler />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/add-hosteler"
				element={
					user === "Warden" ? (
						<AddHosteler />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/fetch-attendance"
				element={
					user === "Warden" ? (
						<FetchAttendance />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-private-grievance"
				element={
					user === "Warden" ? (
						<ViewPrivateGrievances />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-public-grievance"
				element={
					user === "Warden" ? (
						<ViewPublicGrievances />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>

			<Route
				path="/view-notice"
				element={
					user === "Warden" || user === "Hostler" ? (
						<ViewNotice />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/view-mess-menu"
				element={
					user === "Warden" || user === "Hostler" ? (
						<ViewMessMenu />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>

			<Route
				path="/hosteler-login"
				element={
					user === "Hostler" ? (
						<Navigate to="/hosteler-dashboard" replace />
					) : (
						<HostelerLogin />
					)
				}
			/>
			<Route
				path="/hosteler-dashboard"
				element={
					user === "Hostler" ? (
						<HostelerDashboard />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/profile-hosteler"
				element={
					user === "Hostler" ? (
						<ProfilePageHosteler />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/private-grievance"
				element={
					user === "Hostler" ? (
						<PrivateGrievances />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/public-grievance"
				element={
					user === "Hostler" ? (
						<PublicGrievances />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/out-register"
				element={
					user === "Hostler" ? (
						<OutRegister />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/apply-leave"
				element={
					user === "Hostler" ? (
						<ApplyLeave />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/add-details"
				element={
					user === "Hostler" ? (
						<AddDetails />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
		</Routes>
		// </Router>
	);
}

export default App;
