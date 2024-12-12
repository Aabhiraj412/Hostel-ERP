import { useState, useRef, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import useStore from "../../../Store/Store";
import ActivityIndicator from "../../components/ActivityIndicator";

const UploadMessMenu = () => {
	const fileInputRef = useRef(null);
	const { localhost } = useStore();
	const [imageUri, setImageUri] = useState(null);
	const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const routing = {title:"Upload Mess Menu",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

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
	}, [localhost, upload]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
  
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    setUpload(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file); // Append the file directly
  
      const uploadResponse = await fetch(
        `http://${localhost}/api/warden/uploadmessmenu`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      console.log(uploadResponse);

      const data = await uploadResponse.json();

      console.log(data);
  
      if (!uploadResponse.ok) {
        const errorDetails = await uploadResponse.json();
        console.error("Upload error:", errorDetails);
        throw new Error(errorDetails.message || "Upload failed");
      }
  
      console.log("Menu uploaded successfully.");
      alert("Menu uploaded successfully!");
    } catch (uploadError) {
      console.error("Upload Error:", uploadError.message);
      alert(`Failed to upload menu: ${uploadError.message}`);
    } finally {
      setUpload(false);
    }
  };
  
	const handleDownload = () => {
		if (imageUri) {
			const link = document.createElement("a");
			link.href = imageUri;
			link.download = "mess_menu.jpg";
			link.click();
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	return (
		<>
			<MiniVariantDrawer router={routing} />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5">
				<div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-8 max-w-lg w-full">
					<h1 className="text-2xl font-bold text-center text-teal-300 tracking-wider mb-6">
						Mess Menu
					</h1>

					{/* Upload Button */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						hidden
						onChange={handleUpload}
					/>
					<button
						onClick={triggerFileInput}
						className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
					>
						Upload Menu
					</button>

					{/* Download Button */}
					<button
						onClick={handleDownload}
						disabled={!imageUri}
						className={`w-full py-3 px-6 rounded-lg text-white font-semibold mb-6 mt-5 ${
							imageUri
								? "bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black"
								: "bg-gray-400 cursor-not-allowed"
						} transition-all`}
					>
						Download Menu
					</button>

					{(loading || upload) && (
						<div className="w-100 h-screen flex justify-center align-middle">
							<ActivityIndicator />
						</div>
					)}
					{/* Image Preview */}
					{imageUri && (
						<div>
							<p className="text-white mb-2">Current Menu:</p>

							<img
								src={imageUri}
								alt="Mess Menu"
								className="w-full h-auto rounded-lg shadow-md"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default UploadMessMenu;
