import { useEffect, useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const ViewNotice = () => {
	const { localhost, user } = useStore();
	const [loading, setLoading] = useState(false);
	const [notices, setNotices] = useState([]);

	const fetchNotice = async () => {
		setLoading(true);

		try {
			const response = await fetch(
				`${localhost}/api/hostler/getnotices`,
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
				throw new Error(data.message || "Failed to fetch notice.");
			}

			setNotices(data.notices);
			//console.log(data.notices);
		} catch (e) {
			alert(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotice();
	}, [localhost]);

	const handleDownload = async (notice) => {
		try {
			const response = await fetch(
				`${localhost}/api/warden/getnotice/${notice._id}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch the notice");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = `${notice.title || "notice"}.pdf`;
			document.body.appendChild(link);

			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			//console.log("Downloaded successfully");
		} catch (e) {
			console.error(e);
			alert("Failed to download notice.");
		}
	};

	const routing = {
		title: "Notices/Circulars",
		Home: user === "Hostler" ? "/hosteler-dashboard" : "/warden-dashboard",
		Profile: user === "Hostler" ? "/profile-hosteler" : "/profile-warden",
		Notice: "/view-notice",
		Menu: "/view-mess-menu",
	};

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-teal-700 to-black p-5 overflow-auto">
				<div className="w-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-4xl mt-20 mx-20">
					<h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
						NOTICES
					</h1>
					{loading && (
						<div className="flex items-center justify-center">
							<ActivityIndicator size="large" color="#2cb5a0" />
						</div>
					)}
					{notices.map((notice) => (
						<div
							key={notice.id}
							className="w-full mb-6 flex flex-col bg-black/30 backdrop-blur-md p-5 rounded-lg border border-white/20"
						>
							<h2 className="text-xl font-semibold text-teal-300 mb-2">
								{notice.title}
							</h2>
							<p className="text-white mb-2">
								{notice.description}
							</p>
							<p
								onClick={() => handleDownload(notice)}
								className="text-teal-500 underline cursor-pointer hover:text-teal-400"
							>
								Click here to download
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default ViewNotice;
