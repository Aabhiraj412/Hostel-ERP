import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	// Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import useStore from "../../Store/Store";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";

const MessMenu = () => {
	const { localhost, cookie } = useStore();
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const blobToBase64 = (blob) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};

	const fetchMessMenu = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://${localhost}/api/warden/getmessmenu`,
				{
					method: "GET",
					headers: {
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				const errorMessage = await response.json();
				throw new Error(
					errorMessage.message ||
						`Failed to fetch with status code: ${response.status}`
				);
			}

			const blob = await response.blob();
			const filePath = `${FileSystem.cacheDirectory}mess_menu.png`;

			// Convert to base64 and save the file
			const base64Data = await blobToBase64(blob);
			await FileSystem.writeAsStringAsync(filePath, base64Data, {
				encoding: FileSystem.EncodingType.Base64,
			});

			setImageUri(filePath + "?" + new Date().getTime()); // Force re-render by appending timestamp
		} catch (error) {
			console.error("Error fetching mess menu:", error);
			setAlertMessage("Failed to fetch the mess menu.");
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};

	const uploadMenu = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "image/*",
				copyToCacheDirectory: true,
			});

			if (result.type === "cancel") {
				console.log("File selection canceled.");
				return;
			}

			const file = result.assets[0];
			setLoading(true);

			const fileData = new FormData();
			fileData.append("file", {
				uri: file.uri,
				name: file.name || "uploaded_file.png",
				type: file.mimeType || "image/png",
			});

			const response = await fetch(
				`https://${localhost}/api/warden/uploadmessmenu`,
				{
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data",
						Cookie: cookie,
					},
					body: fileData,
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					errorResponse.message || "Login failed. Please try again."
				);
			}

			setSuccessMessage("Mess menu uploaded successfully.");
			setSuccess(true);
			fetchMessMenu(); // Refresh the image after upload
		} catch (error) {
			setAlertMessage(error.message);
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};

	const downloadMenu = async () => {
		if (!imageUri) {
			setAlertMessage("No menu available to download.");
			setAlert(true);
			return;
		}
		setLoading(true);
		try {
			// Request permissions to save files to the gallery
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status !== "granted") {
				setAlertMessage("Cannot save to gallery without permissions.");
				setAlert(true);
				return;
			}

			// Download the image from the server to the app's cache directory
			const downloadPath = `${FileSystem.cacheDirectory}mess_menu.png`;
			const { uri } = await FileSystem.downloadAsync(
				`https://${localhost}/api/warden/getmessmenu`,
				downloadPath
			);

			// Save the downloaded file to the gallery
			const asset = await MediaLibrary.createAssetAsync(uri);
			await MediaLibrary.createAlbumAsync("Download", asset, false);

			setSuccessMessage(`Menu saved to your gallery.`);
			setSuccess(true);
		} catch (error) {
			setAlertMessage("Failed to save the menu to your gallery.");
			setAlert(true);
		}
		finally{
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessMenu();
	}, []);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Mess Menu</Text>
			{imageUri ? (
				<Image
					source={{ uri: imageUri }}
					style={styles.image}
					onError={(e) =>
						console.error("Image load error:", e.nativeEvent.error)
					}
				/>
			) : (
				<Text style={styles.errorText}>No image available</Text>
			)}
			<TouchableOpacity
				style={styles.downloadButton}
				onPress={downloadMenu}
			>
				<Text style={styles.downloadButtonText}>Download Menu</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.uploadButton} onPress={uploadMenu}>
				<Text style={styles.uploadButtonText}>Upload Menu</Text>
			</TouchableOpacity>
			<ErrorAlert
				message={alertMessage}
				alert={alert}
				setAlert={setAlert}
			/>
			<SuccessAlert
				message={successMessage}
				success={success}
				setSuccess={setSuccess}
			/>
		</View>
	);
};

export default MessMenu;

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		padding: 16,
		alignItems: "center",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2cb5a0",
		marginVertical: 16,
	},
	image: {
		width: "90%",
		height: 400,
		resizeMode: "contain",
		borderRadius: 10,
		marginBottom: 20,
		borderWidth: 5, // Thickness of the frame
		borderColor: "#2cb5a0", // Frame color
		backgroundColor: "#fff",
	},
	downloadButton: {
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#2cb5a0",
		borderRadius: 8,
		elevation: 5,
	},
	downloadButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	uploadButton: {
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#f7a400",
		borderRadius: 8,
		elevation: 5,
	},
	uploadButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	errorText: {
		color: "#ff3333",
		fontSize: 16,
	},
});
