import { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import ActivityIndicator from "../../components/ActivityIndicator";
import useStore from "../../../Store/Store";

const PublicGrievances = () => {
	const { localhost } = useStore();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [grievances, setGrievances] = useState([]);
	const [selectedGrievance, setSelectedGrievance] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [upload, setUpload] = useState(false);

	const fetchdata = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}/api/hostler/getPublicgrievance`,
				{
					method: "GET",
					header: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const data = await response.json();

			// console.log(data)
			if (!response.ok) {
				throw new Error(
					data.message || "Unable to Fetch data from API"
				);
			}

			setGrievances(data);
			// console.log(grievances);
		} catch (e) {
			setErrorMessage(e);
			setError(true);
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchdata();
	}, [upload]);

	useEffect(() => {
		const savedGrievances =
			JSON.parse(sessionStorage.getItem("PublicGrievances")) || [];
		setGrievances(savedGrievances);
	}, []);

	useEffect(() => {
		sessionStorage.setItem("PublicGrievances", JSON.stringify(grievances));
	}, [grievances]);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const handleGrievanceSubmit = (event) => {
		event.preventDefault();

		if (!title || !description) {
			alert("Please fill in all the fields.");
			return;
		}

		const newGrievance = {
			title,
			description,
		};

		setUpload(true);

		fetch(`http://${localhost}/api/hostler/Publicgrievance`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newGrievance),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data._id) {
					throw new Error(data.message || "Unable to add grievance");
				}
				setUpload(false);
				console.log(data);
			})
			.catch((error) => {
				setErrorMessage(error);
				setError(true);
				console.log(error);
			});

		toggleDrawer();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
				<div className="flex justify-center h-screen items-center">
					<ActivityIndicator size="large" color="#0d9488" />
				</div>
			</div>
		);
	}

	return (
		<>
			<MiniVariantDrawer title="Public Grievances" />
			<div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
				<div className="flex justify-between items-center">
					<h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
						Public Grievances
					</h1>
					<button
						onClick={toggleDrawer}
						className="mt-20 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
					>
						+ Add Grievance
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 ml-12">
					{error ? (
						<p className="text-white text-center col-span-full font-bold text-xl">
							{errorMessage.message ||
								"An error occurred while fetching grievances."}
						</p>
					) : grievances.length === 0 ? (
						// {error!=="" && <p className="text-white text-center col-span-full font-bold text-xl">{error}</p>}
						<p className="text-white text-center col-span-full font-bold text-xl">
							No grievances submitted yet.
						</p>
					) : (
						grievances.map((grievance, index) => (
							<div
								key={index}
								className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white relative"
							>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm">
										{grievance.date}
									</span>
									<span
										className={`px-3 py-1 rounded-full text-sm ${
											grievance.status === "Resolved"
												? "bg-green-500"
												: grievance.status ===
												  "Pending"
												? "bg-yellow-500"
												: "bg-red-500"
										}`}
									>
										{grievance.status}
									</span>
								</div>
								<h2 className="text-xl font-bold">
									{grievance.title}
								</h2>
								<button
									className="text-teal-300 mt-3 underline"
									onClick={() =>
										setSelectedGrievance(grievance)
									}
								>
									View More
								</button>
							</div>
						))
					)}
				</div>

				{selectedGrievance && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-md">
							<h2 className="text-2xl font-bold text-teal-600">
								{selectedGrievance.title}
							</h2>
							<textarea
								readOnly
								value={selectedGrievance.description}
								className="w-full mt-4 p-3 rounded-lg bg-white text-black border border-white focus:outline-none resize-none min-h-[100px] max-h-[300px] overflow-auto"
								style={{ minHeight: "150px" }}
							/>
							<button
								className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
								onClick={() => setSelectedGrievance(null)}
							>
								Close
							</button>
						</div>
					</div>
				)}

				{isDrawerOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end mr-5">
						<div className="w-96 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg p-8 rounded-lg">
							<h2 className="text-2xl font-bold text-teal-300 mb-6">
								Add Grievance
							</h2>
							<form onSubmit={handleGrievanceSubmit}>
								<label className="block mb-4">
									<span className="text-white">Title</span>
									<input
										type="text"
										name="title"
										placeholder="Enter Grievance title"
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
										required
										className="w-full mt-1 p-3 rounded-lg bg-black text-white border border-white focus:outline-none"
									/>
								</label>
								<label className="block mb-4">
									<span className="text-white">
										Description
									</span>
									<textarea
										name="description"
										placeholder="Enter Grievance description"
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										required
										className="w-full mt-1 p-3 rounded-lg bg-black text-white border border-white focus:outline-none"
									/>
								</label>
                {upload?
								<div className="flex justify-center space-x-4"> 
                <ActivityIndicator size="small" />
                </div>
                :
								<div className="flex justify-end space-x-4">
									<button
										type="button"
										onClick={toggleDrawer}
										className="px-6 py-3 rounded-lg bg-red-500 text-white"
									>
										Discard
									</button>
									<button
										type="submit"
										className="px-6 py-3 rounded-lg bg-teal-500 text-white"
									>
										Submit
									</button>
								</div>}
							</form>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default PublicGrievances;
