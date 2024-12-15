import Card from "@/components/Card";
import { useState } from "react";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
	const {setUser, setData, localhost } = useStore();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!userId || !password) {
			setError("Please enter both user ID and password.");
			return;
		}
		// Set loading state to true and clear any previous error
		setLoading(true);
		setError(null);

		// Send a POST request to the server
		try {
			const response = await fetch(
				`http://${localhost}/api/auth/wardenlogin`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Include cookies
					body: JSON.stringify({
						user: userId,
						password: password,
					}),
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					errorResponse.message || "Login failed. Please try again."
				);
			}

			setUser("Warden");
			const data = await response.json(); // Parse the JSON response
			setData(data);
			navigate('/warden-dashboard');
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				background:
					"radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)",
			}}
		>
			<Card>
				<h1 className="text-center text-2xl font-bold text-white mb-4">
					WARDEN LOGIN
				</h1>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-white mb-1">
							Username:
						</label>
						<input
							type="text"
							placeholder="Enter Email or Phone Number or Aadhar"
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
						/>
					</div>
					<div>
						<label className="block text-white mb-1">
							Password:
						</label>
						<input
							type="password"
							placeholder="Enter Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
						/>
					</div>
					{loading ? (
						<div className="flex justify-center align-middle">
							<ActivityIndicator size="large" color="#0d9488" />
						</div>
					) : (
						<button
							type="submit"
							className="w-full p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
						>
							LOGIN
						</button>
					)}
					{error && (
						<p className="text-red-500 text-sm mt-2 text-center">
							{error}
						</p>
					)}
				</form>
			</Card>
		</div>
	);
};

export default AdminLogin;
