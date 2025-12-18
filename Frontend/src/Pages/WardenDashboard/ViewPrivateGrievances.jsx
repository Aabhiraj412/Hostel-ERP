import { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { FaCheck, FaTimes } from "react-icons/fa";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const ViewPrivateGrievances = () => {
	// Sample grievances data
	const { localhost } = useStore();
	const [grievances, setGrievances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [selected, setSelected] = useState();
	const routing = {
		title: "View Private Grievances",
		Home: "/warden-dashboard",
		Profile: "/profile-warden",
		Attendance: "/fetch-attendance",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	// Fetch grievances
	const fetchGrievances = async () => {
		setLoading(true);
		try {
			// Fetch grievances
			const response = await fetch(
				`${localhost}/api/warden/getprivategrievance`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const grievances = await response.json();

			if (!response.ok) {
				throw new Error(
					grievances.message || "Unable to fetch grievances"
				);
			}

			// Fetch hostler details for each grievance
			const grievanceDetails = await Promise.all(
				grievances.map(async (grievance) => {
					try {
						const hostlerResponse = await fetch(
							`${localhost}/api/warden/getdetail/${grievance.student}`,
							{
								method: "GET",
								credentials: "include",
							}
						);

						const hostlerData = await hostlerResponse.json();
						if (!hostlerResponse.ok) {
							throw new Error(
								hostlerData.message ||
									`Unable to fetch details for student ${grievance.student}`
							);
						}

						// Combine grievance and hostler details
						return {
							...grievance,
							hostlerDetails: hostlerData,
						};
					} catch (error) {
						console.error(
							`Error fetching details for student ${grievance.student}:`,
							error
						);
						// Return grievance data with a fallback for missing hostler details
						return {
							...grievance,
							hostlerDetails: null,
						};
					}
				})
			);

			setGrievances(grievanceDetails);
			//console.log(grievanceDetails);
		} catch (error) {
			console.error("Error fetching grievances:", error);
		} finally {
			setLoading(false);
		}
	};

	// Update grievance status

	useEffect(() => {
		fetchGrievances();
	}, []);

	// Function to resolve a grievance
	const handleResolve = async (grievance) => {
		setSelected(grievance._id);
		setUpdating(true);
		try {
			const id = grievance._id;
			const response = await fetch(
				`${localhost}/api/warden/setprivategrievance/${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "Resolved" }),
					credentials: "include",
				}
			);
			const updatedGrievance = await response.json();

			if (!response.ok) {
				throw new Error(
					updatedGrievance.message ||
						"Failed to update grievance status."
				);
			}
			// Update the local state
			setGrievances((prevGrievances) =>
				prevGrievances.map((grievance) =>
					grievance._id === id ? updatedGrievance : grievance
				)
			);
		} catch (error) {
			console.error("Error updating grievance status:", error);
		} finally {
			setUpdating(false);
			setSelected(null);
		}
	};

	// Function to reject a grievance
	const handleReject = async (grievance) => {
		setSelected(grievance._id);
		setUpdating(true);
		try {
			const id = grievance._id;
			const response = await fetch(
				`${localhost}/api/warden/setprivategrievance/${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "Cancelled" }),
					credentials: "include",
				}
			);
			const updatedGrievance = await response.json();

			if (!response.ok) {
				throw new Error(
					updatedGrievance.message ||
						"Failed to update grievance status."
				);
			}
			// Update the local state
			setGrievances((prevGrievances) =>
				prevGrievances.map((grievance) =>
					grievance._id === id ? updatedGrievance : grievance
				)
			);
		} catch (error) {
			console.error("Error updating grievance status:", error);
		} finally {
			setUpdating(false);
			setSelected(null);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-700 to-black">
				<ActivityIndicator size="large" color="#2cb5a0" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
			<MiniVariantDrawer router={routing} />
			<h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
				Private Grievances
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14 mt-10">
				{grievances.length === 0 ? (
					<p className="text-white text-center col-span-full font-bold text-xl">
						No grievances found.
					</p>
				) : (
					grievances.map((grievance) => (
						<div
							key={grievance.id}
							className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white relative"
						>
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm">
									{new Date(
										grievance.date
									).toLocaleDateString()}
								</span>
							</div>
							<h2 className="text-xl font-bold">
								{grievance.title}
							</h2>
							<p className="mt-2">{grievance.description}</p>
							<div className="mt-4">
								<p className="text-sm font-semibold">
									Status: {grievance.status}
								</p>
							</div>
							{updating && grievance._id === selected ? (
								<div className="flex justify-around items-center mt-6">
									<ActivityIndicator size="small" />
								</div>
							) : (
								<div className="flex justify-around items-center mt-6">
									<button
										className="px-4 py-2 rounded-lg text-white bg-green-500/30 backdrop-blur-lg border border-green-400 hover:bg-green-600/50 transition-all flex items-center gap-2"
										onClick={() => handleResolve(grievance)}
									>
										<FaCheck /> Resolved
									</button>
									<button
										className="px-4 py-2 rounded-lg text-white bg-red-500/30 backdrop-blur-lg border border-red-400 hover:bg-red-600/50 transition-all flex items-center gap-2"
										onClick={() => handleReject(grievance)}
									>
										<FaTimes /> Cancelled
									</button>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ViewPrivateGrievances;
