import { useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { Button, Card, styled } from "@mui/material";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";
import { useNavigate } from "react-router-dom";

const GlassCard = styled(Card)`
	width: 400px;
	height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: rgba(255, 255, 255, 0.2); /* Light transparent background */
	backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
	-webkit-backdrop-filter: blur(10px); /* Safari support for blur effect */
	border: 1px solid rgba(255, 255, 255, 0.3); /* Optional border for frosted look */
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Soft shadow to make it pop */
	border-radius: 15px; /* Rounded corners for a smooth effect */
	position: relative; /* Ensures the card is positioned above everything */
	z-index: 10; /* Make sure it's above other elements */
	transform: translateY(0); /* Default position */
	transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for effects */
	cursor: pointer;
`;
const Btn = styled(Button)`
	background-color: black; /* Background color */
	color: white; /* Text color */
	padding: 10px 15px; /* Padding for button */
	font-size: 16px; /* Font size */
	border-radius: 8px; /* Rounded corners */
	outline: none; /* Remove outline */
	box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Shadow effect */
	width: 150px; /* Width of the button */
	margin: 30px; /* Margin around the button */

	/* Hover effect */
	&:hover {
		background: linear-gradient(
			to right,
			#008080,
			#2f4f4f
		); /* Gradient effect on hover */
		color: black; /* Text color on hover */
		transition: all 0.3s ease-in-out; /* Smooth transition */
	}
`;
const InputField = styled("input")`
	background-color: transparent; /* Makes the background transparent */
	border: 1px solid rgba(255, 255, 255, 0.7); /* Subtle border to match the background */
	color: white; /* Text color that stands out on the background */
	padding: 10px 15px; /* Adds space inside the input field */
	font-size: 16px; /* Adjusts font size */
	border-radius: 8px; /* Rounds the corners for a modern look */
	outline: none; /* Removes the default focus outline */
	box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Subtle shadow on focus */
	width: 250px; /* Adjust width to fit your design */
	margin: 5px;

	/* Placeholder styling */
	&::placeholder {
		color: rgba(
			255,
			255,
			255,
			0.8
		); /* Lighter color for better visibility */
		opacity: 1; /* Make placeholder fully visible */
		font-weight: 600; /* Bold for better emphasis */
	}
`;
const ApplyLeave = () => {
	const routing = {
		title: "Apply for Leave",
		Home: "/hosteler-dashboard",
		Profile: "/profile-hosteler",
		Attendance:"/view-attendance",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};
	const { localhost } = useStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		address: "",
		contact_no: "",
		days: 0,
		from: "",
		to: "",
		reason: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: name === "days" ? parseInt(value) : value,
		}));
	};

	const handleSubmit = async () => {
		const { address, contact_no, days, from, to, reason } = formData;

		// Basic Validation
		if (!address || !contact_no || !days || !from || !to || !reason) {
			alert("All fields are required.");
			return;
		}

		const fromDate = new Date(from);
		const toDate = new Date(to);

		// Validate date range
		if (fromDate > toDate) {
			alert('The "From Date" cannot be after the "To Date".');
			return;
		}

		// Calculate the difference in days
		const dayDifference =
			Math.ceil(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			) + 1;

		console.log(dayDifference, days);

		if (dayDifference !== days) {
			alert("Enetr correct no of Days");
			return;
		}

		//console.log({
		// 	...formData,
		// 	calculatedDays: dayDifference,
		// });

		setLoading(true);

		try {
			const response = await fetch(
				`${localhost}/api/hostler/applyleave`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				}
			);
			const newLeave = await response.json();
			if (!response.ok)
				throw new Error(
					newLeave.message || "Failed to apply for leave."
				);
			setFormData({
				address: "",
				contact_no: "",
				days: "",
				from: "",
				to: "",
				reason: "",
			});
			alert("Successfully applied for leave.");
			navigate("/hosteler-dashboard");
		} catch (error) {
			console.error("Error applying for leave:", error);
			alert("Failed to apply for leave. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div
				className="min-h-screen flex items-center justify-center"
				style={{
					background:
						"radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)",
				}}
			>
				<GlassCard>
					<InputField
						type="text"
						name="address"
						placeholder="To Where"
						value={formData.address}
						onChange={handleChange}
					/>
					<InputField
						type="number"
						name="days"
						placeholder="No of days"
						value={formData.days}
						onChange={handleChange}
					/>
					<InputField
						type="date"
						name="from"
						placeholder="From Date"
						value={formData.from}
						onChange={handleChange}
					/>
					<InputField
						type="date"
						name="to"
						placeholder="To Date"
						value={formData.to}
						onChange={handleChange}
					/>
					<InputField
						type="text"
						name="reason"
						placeholder="Reason"
						value={formData.reason}
						onChange={handleChange}
					/>
					<InputField
						type="text"
						name="contact_no"
						placeholder="Contact Number"
						value={formData.contact_no}
						onChange={handleChange}
					/>
					{loading ? (
						<ActivityIndicator size="large" />
					) : (
						<Btn onClick={handleSubmit}>Apply Leave</Btn>
					)}
				</GlassCard>
			</div>
		</>
	);
};

export default ApplyLeave;
