import { useEffect, useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const ViewMessMenu = () => {
	const { localhost, user } = useStore();
	const [imageUri, setImageUri] = useState(null);
	const [loading, setLoading] = useState(false);
	const routing = {
		title: "Mess Menu",
		Home: user === "Hostler" ? "/hosteler-dashboard" : "/warden-dashboard",
		Profile: user === "Hostler" ? "/profile-hosteler" : "/profile-warden",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	useEffect(() => {
		const fetchMessMenu = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://${localhost}/api/hostler/getmessmenu`,
					{
						method: "GET",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to load the mess menu.");
				}

				// Get the response as a Blob
				const blob = await response.blob();

				// Convert Blob to Base64
				const base64String = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () =>
						resolve(reader.result.split(",")[1]);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});

				// Construct the image URI with base64 data
				const imageUri = `data:image/png;base64,${base64String}`;
				setImageUri(imageUri);
			} catch (error) {
				console.error("Failed to load the mess menu.", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMessMenu();
	}, [localhost]);

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = imageUri;
		link.download = "mess_menu.jpg";
		link.click();
	};

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5">
				<div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-lg w-full">
					<h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
						Mess Menu
					</h1>
					<button
						onClick={handleDownload}
						className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-slate-600 hover:to-black hover:from-teal-600 text-white rounded-lg text-center font-semibold mb-6 transition-all duration-300"
					>
						Download Menu
					</button>
					<div>
						<p className="text-white mb-2">Current Menu:</p>
						<div className="flex justify-center align-middle">
							{loading && <ActivityIndicator />}
							{imageUri ? (
								<img
									src={imageUri}
									alt="Mess Menu"
									className="w-full h-auto rounded-lg shadow-md"
								/>
							) : (
								!loading && (
									<text className="text-red-600">
										Unable to Fetch
									</text>
								)
							)}
						</div>
						{/* <img
							src={imageUri}
							alt="Mess Menu"
							className="w-full h-auto rounded-lg shadow-md"
						/> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewMessMenu;
