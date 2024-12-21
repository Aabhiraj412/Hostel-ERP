import Card from "@/components/Card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const HostelerLogin = () => {
	const navigate = useNavigate();
	const {setUser, setData, localhost } = useStore();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!userId || !password) {
			setError("Please fill all fileds");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			console.log(`${localhost}/api/auth/hostlerlogin`);
			
			const response = await fetch(
				`${localhost}/api/auth/hostlerlogin`, // Consider using environment variables here
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						user: userId,
						password: password,
					}),
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				if (errorResponse.message === "Invalid Credentials") {
					throw new Error("Invalid credentials. Please try again.");
				}
				throw new Error(
					`Login failed with status code: ${response.status}`
				);
			}

			const data = await response.json();

			setUser("Hostler");

			setData(data);

			navigate("/hosteler-dashboard");
		} catch (error) {
			setError(error.message); // Handle errors
		} finally {
			setLoading(false); // Stop loading
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
					HOSTELER LOGIN
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
							<ActivityIndicator size="small" color="#0d9488" />
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

export default HostelerLogin;
