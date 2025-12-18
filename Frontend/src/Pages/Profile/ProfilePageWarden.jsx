// import React from "react";
// import MiniVariantDrawer from "../../components/MiniVariantDrawer";
// import { Card, styled, Typography } from "@mui/material";
// import Button from "../../components/Button";

// const GlassCard = styled(Card)`
//   width: 90%;
//   max-width: 600px;
//   padding: 20px;
//   margin-top: 20px;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   background: rgba(255, 255, 255, 0.2); /* Transparent glass effect */
//   backdrop-filter: blur(10px);
//   -webkit-backdrop-filter: blur(10px);
//   border: 1px solid rgba(255, 255, 255, 0.3);
//   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
//   border-radius: 15px;
//   color: white;
// `;

// const ProfilePageWarden = () => {
//   const handleLogout = () => {
//     alert("Logged out!");
//   };
//   const routing = {title:"Warden dashboard",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

//   const handleSetPassword = () => {
//     alert("Redirecting to set password page!");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-6">
//       <MiniVariantDrawer router={routing} />

//       <GlassCard>
//         <Typography
//           variant="h5"
//           style={{
//             textAlign: "center",
//             marginBottom: "20px",
//             fontWeight: "bold",
//             textTransform: "uppercase",
//           }}
//         >
//           Warden Details
//         </Typography>

//         {/* Warden Information Section */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//           {[
//             { label: "Name", value: "Dr. Rajesh Kumar" },
//             { label: "Phone No.", value: "9876543210" },
//             { label: "Email", value: "warden.mpec@gmail.com" },
//             { label: "Aadhar No.", value: "123456789012" },
//             { label: "Gender", value: "Male" },
//             { label: "Hostel", value: "Aryabhatt" },
//             { label: "Post", value: "Chief Warden" },
//             { label: "Address", value: "MPEC Hostel Campus, Lucknow" },
//           ].map((item, index) => (
//             <Typography
//               key={index}
//               variant="body1"
//               style={{
//                 fontSize: "16px",
//                 fontWeight: "500",
//                 lineHeight: "1.5",
//               }}
//             >
//               <span style={{ color: "#80d4ff", fontWeight: "bold" }}>
//                 {item.label}:
//               </span>{" "}
//               <span style={{ color: "#222222", fontWeight: "bold" }}>
//                 {item.value}
//               </span>
//             </Typography>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//           <Button label="Logout" onClick={handleLogout} />
//           <Button label="Set Password" onClick={handleSetPassword} />
//         </div>
//       </GlassCard>
//     </div>
//   );
// };

// export default ProfilePageWarden;

import { useEffect, useState } from "react";
import useStore from "../../../Store/Store";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import {
	Card,
	Typography,
	Button,
	DialogActions,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
} from "@mui/material";
import ActivityIndicator from "../../components/ActivityIndicator";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const GlassCard = styled(Card)`
	width: 90%;
	max-width: 600px;
	padding: 20px;
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	position: relative;
	background: rgba(255, 255, 255, 0.2); /* Transparent glass effect */
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
	border-radius: 15px;
	color: white;
`;

const CustomDialog = styled(Dialog)`
	.MuiDialog-paper {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		border-radius: 15px;
	}
`;

const LogoutButton = styled(Button)`
	position: absolute;
	bottom: 20px;
	right: 20px;
	font-weight: bold;
`;

const SetPasswordButton = styled(Button)`
	position: absolute;
	bottom: 20px;
	left: 20px;
	font-weight: bold;
`;

const ProfilePageWarden = () => {
	const { data, localhost, setData, setUser } = useStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loggingOut, setLoggingOut] = useState(false);
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState();
	const [conpass, setConpass] = useState();
	const [dialog, setDialog] = useState(false);
	const [diaload, setDiaload] = useState(false);
	const routing = {
		title: "Warden Profile",
		Home: "/warden-dashboard",
		Profile: "/profile-warden",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	const setpass = async () => {
		if (!password || !conpass) {
			alert("Please enter both fields.");
			return;
		}

		if (password !== conpass) {
			alert("Passwords do not match.");
			return;
		}

		if (password.length < 6) {
			alert("Password must be atleast 6 characters long.");
			return;
		}

		// setError(null); // Clear error if any
		setDiaload(true); // Set logging out to true to show loading indicator

		try {
			const response = await fetch(
				`${localhost}/api/warden/resetpass`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						password: password,
						confirm_password: conpass,
					}),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Password change failed.");
			}

			alert("Password changed successfully.");
			// setmes(true);
			setDialog(false);
		} catch (error) {
			alert(error);
			console.log(error);
		} finally {
			setDiaload(false);
		}
	};

	const fetchWardenData = async () => {
		try {
			const response = await fetch(
				`${localhost}/api/Warden/getdetails`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || "Failed to fetch Warden data."
				);
			}

			setData(result);
		} catch (error) {
			console.error("Error fetching Warden data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWardenData();
	}, [localhost, setData]);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			const response = await fetch(
				`${localhost}/api/auth/wardenlogout`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || "Failed to log out.");
			}

			setData(null);
			setUser(null);
			navigate("/");
		} catch (error) {
			console.error("Logout error:", error.message);
		} finally {
			setLoggingOut(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black">
				<ActivityIndicator size="large" color="#2cb5a0" />
			</div>
		);
	}

	if (!data) {
		return (
			<>
				<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
					<MiniVariantDrawer router={routing} />
					<GlassCard>
						<p className="text-center text-red-600">
							No data available for the Warden.
						</p>
					</GlassCard>
				</div>
			</>
		);
	}

	const handleOpenDialog = () => setOpen(true);
	const handleCloseDialog = () => setOpen(false);
	const handleDialog1 = () => setDialog(true);
	const handleDialog2 = () => setDialog(false);

	const confirmLogout = () => {
		handleLogout();
		handleCloseDialog();
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
			<MiniVariantDrawer router={routing} />
			<GlassCard>
				<Typography
					variant="h4"
					style={{
						textAlign: "center",
						marginBottom: "20px",
						fontWeight: "bold",
					}}
				>
					Warden Profile
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Name:</strong> {data.name}
				</Typography>

				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Aadhar No:</strong> {data.aadhar}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Gender:</strong>{" "}
					{data.gender === "male" ? "Male" : "Female"}
				</Typography>

				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Phone No:</strong> {data.phone}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Email:</strong> {data.email}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Address:</strong> {data.address}
				</Typography>

				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Post:</strong> {data.post}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Hostel:</strong> {data.hostel}
				</Typography>

				<SetPasswordButton
					variant="contained"
					color="primary"
					onClick={handleDialog1}
				>
					Reset Password
				</SetPasswordButton>

				<LogoutButton
					variant="contained"
					color="error"
					onClick={handleOpenDialog}
					disabled={loggingOut}
				>
					{loggingOut ? "Logging out..." : "Logout"}
				</LogoutButton>
			</GlassCard>

			<CustomDialog open={dialog} onClose={handleDialog2}>
				<DialogTitle>Reset your password</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						fullWidth
						variant="outlined"
						placeholder="Input password"
					/>
					<TextField
						autoFocus
						margin="dense"
						label=" Confirm Password"
						type="password"
						value={conpass}
						onChange={(e) => setConpass(e.target.value)}
						fullWidth
						variant="outlined"
						placeholder="Confirm Password"
					/>
				</DialogContent>
				{diaload ? (
					<DialogActions>
						<ActivityIndicator size="small" color="primary"/>
					</DialogActions>
				) : (
					<DialogActions>
						<Button onClick={handleDialog2} color="primary">
							Cancel
						</Button>
						<Button color="primary" onClick={setpass}>
							Set Password
						</Button>
					</DialogActions>
				)}
			</CustomDialog>

			<CustomDialog open={open} onClose={handleCloseDialog}>
				<DialogTitle>Confirm Logout</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to log out?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Cancel
					</Button>
					<Button
						onClick={confirmLogout}
						color="error"
						disabled={loggingOut}
					>
						{loggingOut ? "Logging out..." : "Logout"}
					</Button>
				</DialogActions>
			</CustomDialog>
		</div>
	);
};

export default ProfilePageWarden;
