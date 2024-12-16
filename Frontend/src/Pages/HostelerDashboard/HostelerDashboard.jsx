import { useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { Card, styled, Typography } from "@mui/material";
import {
	AccountCircle,
	TaskAlt,
	CalendarToday,
	Assignment,
	HelpOutline,
	Lock,
	RestaurantMenu,
	Campaign,
	PersonAdd,
} from "@mui/icons-material";
import AttendanceModal from "../../components/AttendanceModel";

import { useNavigate } from "react-router-dom";
import useStore from "../../../Store/Store";

const GlassCard = styled(Card)`
	width: 160px;
	height: 160px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	border-radius: 15px;
	position: relative;
	z-index: 10;
	transform: translateY(0);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;

	&:hover {
		transform: translateY(-10px);
		box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2);
	}
`;

const HostelerDashboard = () => {
	const [openModal, setOpenModal] = useState(false);
	const { localhost, testlocalhost } = useStore();
	const navigate = useNavigate();
	const routing = {
		title: "Hosteler Dashboard",
		Home: "/hosteler-dashboard",
		Profile: "/profile-hosteler",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	const dashboardItems = [
		{
			icon: <AccountCircle fontSize="large" />,
			label: "Profile",
			route: "/profile-hosteler",
		},
		{ icon: <TaskAlt fontSize="large" />, label: "Mark Attendance" },
		{
			icon: <CalendarToday fontSize="large" />,
			label: "Leaves",
			route: "/apply-leave",
		},
		{
			icon: <Assignment fontSize="large" />,
			label: "Out Register",
			route: "/out-register",
		},
		{
			icon: <HelpOutline fontSize="large" />,
			label: "Public Grievances",
			route: "/public-grievance",
		},
		{
			icon: <Lock fontSize="large" />,
			label: "Private Grievances",
			route: "/private-grievance",
		},
		{
			icon: <RestaurantMenu fontSize="large" />,
			label: "Mess Menu",
			route: "/view-mess-menu",
		},
		{
			icon: <Campaign fontSize="large" />,
			label: "Notices",
			route: "/view-notice",
		},
		{
			icon: <PersonAdd fontSize="large" />,
			label: "Add Details",
			route: "/add-details",
		},
	];

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const handleMarkAttendance = async () => {
		if (!localhost && !testlocalhost) {
			alert("Attendance IP not set");
			return;
		}

		try {
			const getip = await fetch(`http://${localhost}/api/hostler/getip`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!getip.ok) {
				alert("Error fetching IP");
				return;
			}

			const data = await getip.json();

			const ip = data.ip;

			console.log(ip, testlocalhost);

			if (testlocalhost !== ip) {
				alert("Attendance IP not matched. Connect to Hostel Wi-Fi");
				return;
			}

			const markAttendance = await fetch(
				`http://${localhost}/api/hostler/markattendance`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const result = await markAttendance.json();

			if (!markAttendance.ok) {
				alert(result.message);
				return;
			}

			console.log("Attendance marked");
			handleCloseModal();
		} catch (error) {
			console.log(error);
			alert("Error marking attendance");
		}
	};

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
				{/* Grid Container */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:mt-20 mb-10">
					{dashboardItems.map((item, index) => (
						<GlassCard
							key={index}
							onClick={
								item.label === "Mark Attendance"
									? handleOpenModal
									: () => navigate(item.route)
							}
						>
							<div
								style={{ color: "white", marginBottom: "10px" }}
							>
								{item.icon}
							</div>
							<Typography
								variant="body1"
								style={{ color: "white", fontWeight: "bold" }}
							>
								{item.label}
							</Typography>
						</GlassCard>
					))}
				</div>
			</div>

			<AttendanceModal
				open={openModal}
				onClose={handleCloseModal}
				onMarkAttendance={handleMarkAttendance}
			/>
		</>
	);
};

export default HostelerDashboard;
