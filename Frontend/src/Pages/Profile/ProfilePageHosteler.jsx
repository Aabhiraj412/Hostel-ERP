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
} from "@mui/material";
import ActivityIndicator from "../../components/ActivityIndicator";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const GlassCard = styled(Card)`
	width: 90%;
	height: 80%;
	margin-top: 30px;
	margin-left: 60px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	position: relative;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
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

const ProfilePageHosteler = () => {
  const routing = {title:"Hosteler Profile",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }
	const { data, localhost, cookie, setData, setUser, setCookie } = useStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loggingOut, setLoggingOut] = useState(false);
	const [open, setOpen] = useState(false);

	const fetchHostlerData = async () => {
		try {
			console.log(cookie);
			const response = await fetch(
				`http://${localhost}/api/hostler/getdetails`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			console.log(response);

			const result = await response.json();

			console.log(result);
			if (!response.ok) {
				throw new Error(
					result.message || "Failed to fetch hostler data."
				);
			}

			setData(result);
		} catch (error) {
			console.error("Error fetching hostler data:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchHostlerData();
	}, [localhost, cookie, setData]);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			const response = await fetch(
				`http://${localhost}/api/auth/hostlerlogout`,
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

			setCookie(null);
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
					<MiniVariantDrawer title="Hostler Profile" />
					<GlassCard>
						{/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black"> */}
						<p className="text-center text-red-600">
							No data available for the Hostler.
						</p>
						{/* </div> */}
					</GlassCard>
				</div>
			</>
		);
	}

	const handleOpenDialog = () => setOpen(true);
	const handleCloseDialog = () => setOpen(false);

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
					Hosteler Details
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Name:</strong> {data.name}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Roll No.:</strong> {data.roll_no}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Aadhar No.:</strong> {data.aadhar}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Gender:</strong> {data.gender}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Father&apos;s Name:</strong> {data.fathers_name}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Mother&apos;s Name:</strong> {data.mothers_name}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Phone No.:</strong> {data.phone_no}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Email:</strong> {data.email}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Address:</strong> {data.address}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Year:</strong> {data.year}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>College:</strong> {data.college}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Hostel:</strong> {data.hostel}
				</Typography>
				<Typography variant="body1" style={{ marginBottom: "10px" }}>
					<strong>Room No.:</strong> {data.room_no}
				</Typography>

				<LogoutButton
					variant="contained"
					color="error"
					onClick={handleOpenDialog}
					disabled={loggingOut}
				>
					{loggingOut ? "Logging out..." : "Logout"}
				</LogoutButton>
			</GlassCard>

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

export default ProfilePageHosteler;