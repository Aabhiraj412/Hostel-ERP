import { Card, styled } from "@mui/material";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import useStore from "../../../Store/Store";
import { format } from "date-fns";
import ActivityIndicator from "../../components/ActivityIndicator";

const GlassCard = styled(Card)`
	width: 350px;
	margin: 15px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: rgba(255, 255, 255, 0.2); /* Glassmorphic effect */
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 15px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	color: white;
`;

const FetchAttendance = () => {
	// Data for students (used for the card layout)
	const { localhost } = useStore();
	const [loading, setLoading] = useState(true);
	const [selectedLeave, setSelectedLeave] = useState(null);
	const [studentDetails, setStudentDetails] = useState([]); // State for student details
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const routing = {
		title: "View Leaves",
		Home: "/warden-dashboard",
		Profile: "/profile-warden",
		Attendance: "/fetch-attendance",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	// Fetch leave applications
	const fetchLeaves = async () => {
		try {
			const response = await fetch(`${localhost}/api/warden/getleaves`, {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Unable to fetch entries."
				);
			}

			const data = await response.json();

			const students = await Promise.all(
				data.map(async (entry) => {
					try {
						const response = await fetch(
							`${localhost}/api/warden/getdetail/${entry.student}`,
							{
								method: "GET",
								credentials: "include",
							}
						);

						const studentData = await response.json();
						if (!response.ok) {
							const studentErrorData = await studentData.json();
							throw new Error(
								studentErrorData.message ||
									"Unable to fetch student details."
							);
						}

						// Return the mapped student data
						return {
							id: entry._id,
							name: studentData.name,
							room_no: studentData.room_no,
							address: entry.address,
							contact_no: entry.contact_no,
							createdAt: entry.createdAt,
							days: entry.days,
							from: entry.from,
							reason: entry.reason,
							status: entry.status,
							to: entry.to,
							updatedAt: entry.updatedAt,
						};
					} catch (error) {
						console.error("Error fetching student details:", error);
						return null; // Ensure an entry is always returned
					}
				})
			);

			// Filter out any null values (in case of failed fetch)
			const validStudents = students.filter(
				(student) => student !== null
			);

			// Update state with the new data
			setStudentDetails((prevDetails) => [
				...prevDetails,
				...validStudents,
			]);
		} catch (fetchError) {
			console.error("Error fetching leaves:", fetchError);
			setErrorMessage(fetchError.message || "Something went wrong.");
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	// Update leave status
	useEffect(() => {
		fetchLeaves();
		// //console.log(studentDetails);
	}, [updating]);

	// Function to determine the status color
	const getStatusColor = (status) => {
		switch (status) {
			case "Approved":
				return "text-green-400"; // Green for approved
			case "Rejected":
				return "text-red-400"; // Red for rejected
			case "Pending":
			default:
				return "text-yellow-400"; // Yellow for pending
		}
	};

	// Handle Accept button click
	const handleAccept = async (leaveId) => {
		setSelectedLeave(leaveId);
		setUpdating(true);
		try {
			const response = await fetch(
				`${localhost}/api/warden/setleave/${leaveId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ status: "Approved" }),
				}
			);

			const updatedLeave = await response.json();

			if (!response.ok) {
				throw new Error(
					updatedLeave.message ||
						"Failed to update leave status. Please try again."
				);
			}

			// Update the local state
			// setStudentDetails((prevLeaves) =>
			// 	prevLeaves.map((leave) =>
			// 		leave.id === leaveId ? updatedLeave : leave
			// 	)
			// );
			setSelectedLeave(null); // Close modal after updating
		} catch (e) {
			console.error("Error updating leave status:", e);
			setErrorMessage(e);
			setError(true);
		} finally {
			fetchLeaves();
			setUpdating(false);
		}
	};

	// Handle Reject button click
	const handleReject = async (leaveId) => {
		setSelectedLeave(leaveId);
		setUpdating(true);
		try {
			const response = await fetch(
				`${localhost}/api/warden/setleave/${leaveId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ status: "Rejected" }),
				}
			);

			const updatedLeave = await response.json();

			if (!response.ok) {
				throw new Error(
					updatedLeave.message ||
						"Failed to update leave status. Please try again."
				);
			}

			// Update the local state
			// setStudentDetails((prevLeaves) =>
			// 	prevLeaves.map((leave) =>
			// 		leave.id === leaveId ? updatedLeave : leave
			// 	)
			// );
			setSelectedLeave(null); // Close modal after updating
		} catch (e) {
			console.error("Error updating leave status:", e);
			setErrorMessage(e);
			setError(true);
		} finally {
			setUpdating(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black">
				<ActivityIndicator size="large" color="#2cb5a0" />
			</div>
		);
	}
if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5 pt-20">
				<div className="flex flex-wrap justify-center gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
					<p className="text-red-500 text-center font-bold text-xl">
						{errorMessage}
					</p>
				</div>
			</div>
		);
	}
	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5 pt-20">
				<div className="flex flex-wrap justify-center gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
					{studentDetails.map((student) => (
						<GlassCard key={student.id}>
							<h2 className="text-xl font-bold text-teal-300 mb-4">
								Student Details
							</h2>
							<p>
								<strong>Name:</strong> {student.name}
							</p>
							<p>
								<strong>Room No:</strong> {student.room_no}
							</p>
							<p>
								<strong>Contact:</strong> {student.contact_no}
							</p>
							{/* <p>
								<strong>Room Number:</strong>{" "}
								{student.roomNumber}
							</p> */}
							<p>
								<strong>From:</strong>{" "}
								{format(new Date(student.from), "dd/MM/yyyy")}
							</p>
							<p>
								<strong>To:</strong>{" "}
								{format(new Date(student.to), "dd/MM/yyyy")}
							</p>
							{/* <p>
								<strong>From Date:</strong> {student.fromDate}
							</p>
							<p>
								<strong>To Date:</strong> {student.toDate}
							</p> */}
							<p>
								<strong>Purpose:</strong> {student.reason}
							</p>
							<p>
								<strong>No. of Days:</strong> {student.days}
							</p>
							<p
								className={`${getStatusColor(
									student.status
								)} font-semibold`}
							>
								<strong>Status:</strong> {student.status}
							</p>

							{updating && selectedLeave === student.id ? (
								<div className="flex justify-around items-center mt-6">
									<ActivityIndicator />
								</div>
							) : (
								<div className="flex justify-around items-center mt-6">
									<button
										className="px-4 py-2 rounded-lg text-white bg-green-500/30 backdrop-blur-lg border border-green-400 hover:bg-green-600/50 transition-all flex items-center gap-2"
										onClick={() => handleAccept(student.id)}
									>
										<FaCheck /> Approve
									</button>
									<button
										className="px-4 py-2 rounded-lg text-white bg-red-500/30 backdrop-blur-lg border border-red-400 hover:bg-red-600/50 transition-all flex items-center gap-2"
										onClick={() => handleReject(student.id)}
									>
										<FaTimes /> Reject
									</button>
								</div>
							)}
						</GlassCard>
					))}
				</div>
			</div>
		</>
	);
};

export default FetchAttendance;
