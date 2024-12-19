import { useEffect, useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from "@/components/Card";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const FetchAttendance = () => {
	const { localhost } = useStore();
	const [selectedHostel, setSelectedHostel] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formattedDate, setFormatedDate] = useState("");
	const routing = {
		title: "View Attendance",
		Home: "/warden-dashboard",
		Profile: "/profile-warden",
		Attendence: "/fetch-attendance",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	const hostelOptions = [
		{ label: "All Hostels", value: null },
		...Array.from(new Set(students.map((hostler) => hostler.hostel))).map(
			(hostel) => ({
				label: hostel,
				value: hostel,
			})
		),
	];

	const fetchAttendance = async () => {
		let date = selectedDate;

		if (!selectedDate) {
			date = new Date(); // Default to today's date if not set
			setSelectedDate(date);
		}

		setLoading(true);
		setErrorMessage("");

		const localFormattedDate = `${date.toLocaleDateString("en-CA", {
			timeZone: "Asia/Kolkata",
		})}T18:30:00.000Z`;
		setFormatedDate(localFormattedDate);

		//console.log("Selected Date:", date);
		//console.log("Formatted Date:", localFormattedDate);
		//console.log("Selected Hostel:", selectedHostel);

		try {
			//console.log(formattedDate);
			const response = await fetch(
				`${localhost}/api/warden/gethostlers`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch attendance data.");
			}

			const fetchedStudents = await response.json();
			//console.log(fetchedStudents);
			setStudents(fetchedStudents);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttendance();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
			<MiniVariantDrawer router={routing} />

			<div className="mx-14 mt-20">
				{/* Date Picker */}
				<div className="mb-6">
					<label className="text-white font-bold block mb-2">
						Select Date:
					</label>
					<DatePicker
						selected={selectedDate}
						onChange={(date) => setSelectedDate(date)}
						className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-3 text-white relative"
						dateFormat="yyyy-MM-dd"
						placeholderText="Select Date"
					/>
				</div>

				{/* Dropdown for Hostel Selection */}
				<div className="mb-6">
					<label className="text-white font-bold block mb-2">
						Select Hostel:
					</label>
					<Select
						options={hostelOptions}
						value={
							hostelOptions.find(
								(opt) => opt.value === selectedHostel?.value
							) || null
						}
						onChange={(option) => setSelectedHostel(option)}
						placeholder="All Hostels"
						styles={{
							control: (base) => ({
								...base,
								backgroundColor: "rgba(255, 255, 255, 0.2)",
								backdropFilter: "blur(8px)",
								color: "white",
								border: "1px solid rgba(255, 255, 255, 0.3)",
								padding: "4px",
							}),
							singleValue: (base) => ({
								...base,
								color: "white",
							}),
							menu: (base) => ({
								...base,
								backgroundColor: "rgba(255, 255, 255, 0.2)",
								backdropFilter: "blur(8px)",
								border: "1px solid rgba(255, 255, 255, 0.3)",
							}),
							option: (base, state) => ({
								...base,
								backgroundColor: state.isFocused
									? "rgba(255, 255, 255, 0.4)"
									: "transparent",
								color: "black",
								cursor: "pointer",
							}),
						}}
					/>
				</div>

				{/* Fetch Button */}
				<div className="mb-6">
					<button
						onClick={fetchAttendance}
						className="text-white bg-teal-600 px-4 py-2 rounded-md"
					>
						{loading ? "Fetching..." : "Fetch Attendance"}
					</button>
				</div>

				{/* Error Message */}
				{errorMessage && (
					<p className="text-red-500 font-bold mb-4">
						{errorMessage}
					</p>
				)}

				{/* Displaying Student Cards */}
				{loading ? (
					<div className="flex items-center justify-center">
						<ActivityIndicator size="large" color="#2cb5a0" />
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						{students.length === 0 ? (
							<p className="text-white col-span-full text-center text-lg font-bold">
								No students found for the selected date and
								hostel.
							</p>
						) : (
							students
								.filter(
									(student) =>
										!selectedHostel ||
										student.hostel === selectedHostel?.value
								)
								.map((student, index) => (
									// student.hostel === selectedHostel && (
									<Card key={index}>
										<h2 className="text-xl font-bold text-teal-300 mb-4">
											Student Details
										</h2>
										<p className="text-white">
											Name: {student.name}
										</p>
										<p className="text-white">
											Room No: {student.room_no}
										</p>
										<p className="text-white">
											Phone: {student.phone_no}
										</p>
										<p className="text-white">
											Hostel Name: {student.hostel}
										</p>
										<p
											className={`text-white ${
												student.present
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											Status:{" "}
											{student.present_on.includes(
												formattedDate
											)
												? "Present"
												: "Absent"}
										</p>
									</Card>
								))
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default FetchAttendance;
