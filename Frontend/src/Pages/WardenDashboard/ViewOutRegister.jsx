import { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import OutingDetailsCard from "../../components/OutingDetailsCard";
import Card from "@/components/Card.jsx";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const OutRegister = () => {
	const [outingDetailsList, setOutingDetailsList] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const { localhost } = useStore();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const routing = {title:"View Out Register",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

	useEffect(() => {
		const fetchEntries = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://${localhost}/api/warden/getentries`,
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Unable to fetch entries");
				}

				const outingDetailsList = await Promise.all(
					data.map(async (entry) => {
						try {
							const studentDetailsResponse = await fetch(
								`http://${localhost}/api/warden/getdetail/${entry.student}`,
								{
									method: "GET",
									credentials: "include",
									headers: {
										"Content-Type": "application/json",
									},
								}
							);
							const studentDetails =
								await studentDetailsResponse.json();

							return {
								id: entry._id,
								purpose: entry.purpose,
								outTime: new Date(
									entry.out_time
								).toLocaleTimeString(),
								inTime: entry.in_time
									? new Date(
											entry.in_time
									  ).toLocaleTimeString()
									: "Not Returned Yet",
								studentDetails: {
									name: studentDetails.name || "Unknown",
									rollNo: studentDetails.roll_no || "N/A",
									phone: studentDetails.phone_no || "N/A",
									hostelName: studentDetails.hostel || "N/A",
									roomNumber: studentDetails.room_no || "N/A",
								},
							};
						} catch (error) {
							console.error(
								`Failed to fetch student details for ${entry.student}`,
								error
							);
							return {
								id: entry._id,
								purpose: entry.purpose,
								outTime: new Date(
									entry.out_time
								).toLocaleTimeString(),
								inTime: new Date(
									entry.in_time
								).toLocaleTimeString(),
								studentDetails: {
									name: "Unknown",
									rollNo: "N/A",
									phone: "N/A",
									hostelName: "N/A",
									roomNumber: "N/A",
								},
							};
						}
					})
				);

				setOutingDetailsList(outingDetailsList);
			} catch (error) {
				console.error("Error fetching entries:", error);
				setErrorMessage(error.message);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchEntries();
	}, [localhost]);

	const handleCardClick = (studentDetails) => {
		setSelectedStudent(studentDetails);
	};

	const handleOverlayClick = (e) => {
		if (e.target.id === "popup-overlay") {
			setSelectedStudent(null);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<ActivityIndicator size="large" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
			<MiniVariantDrawer router={routing} />
			<h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
				Hostel Out Register
			</h1>

			<div className="grid gap-6 mx-14 mt-10">
				{error ? (
					<p className="text-red-500 text-center font-bold text-xl">
						{errorMessage}
					</p>
				) : outingDetailsList.length === 0 ? (
					<p className="text-white text-center font-bold text-xl">
						No outing details available.
					</p>
				) : (
					outingDetailsList.map((details) => (
						<div
							key={details.id}
							onClick={() =>
								handleCardClick(details.studentDetails)
							}
							className="cursor-pointer"
						>
							<OutingDetailsCard
								outingDetails={{
									...details,
									inTime: (
										<span
											className={`${
												details.inTime ===
												"Not Returned Yet"
													? "text-red-500"
													: "text-white"
											}`}
										>
											{details.inTime}
										</span>
									),
								}}
							/>
						</div>
					))
				)}
			</div>

			{/* Popup Card */}
			{selectedStudent && (
				<div
					id="popup-overlay"
					onClick={handleOverlayClick}
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
				>
					<Card>
						<h2 className="text-xl font-bold text-teal-300 mb-4">
							Student Details
						</h2>
						<p className="text-white">
							Name: {selectedStudent.name}
						</p>
						<p className="text-white">
							Roll No: {selectedStudent.rollNo}
						</p>
						<p className="text-white">
							Phone: {selectedStudent.phone}
						</p>
						<p className="text-white">
							Hostel Name: {selectedStudent.hostelName}
						</p>

						{/* Conditionally style the Not Returned Yet text in red */}
						<p className={`text-white`}>
							Room Number: {selectedStudent.roomNumber}
						</p>
					</Card>
				</div>
			)}
		</div>
	);
};

export default OutRegister;
