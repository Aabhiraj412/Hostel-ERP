import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import useStore from "../../Store/Store";

const MessMenu = () => {
	const { localhost, cookie } = useStore();
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
  const [file,setFile] = useState<any>(null);

	const getMessMenu = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/warden/getmessmenu`,
				{
					headers: {
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Request failed with status code: ${response.status}`
				);
			}

			setImageUri(response.url);
		} catch (error) {
			console.error("Error fetching mess menu:", error.message || error);
			Alert.alert("Error", "Failed to fetch the mess menu.");
		} finally {
			setLoading(false);
		}
	};

	const downloadMenu = async () => {
		if (!imageUri) return;

		try {
			const downloadPath = `${FileSystem.documentDirectory}mess_menu.png`;
			const { uri } = await FileSystem.downloadAsync(
				imageUri,
				downloadPath
			);

			Alert.alert("Success", `File downloaded to: ${uri}`);
		} catch (error) {
			console.error("Error downloading file:", error.message || error);
			Alert.alert("Error", "Failed to download the menu.");
		}
	};

	
	const uploadMenu = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "image/*",
				copyToCacheDirectory: true,
			});

			if (result.type === "cancel") {
				Alert.alert("Canceled", "File selection was canceled.");
				return;
			}

			setLoading(true);

			const fileData = new FormData();
			fileData.append("menu", {
				uri: result.uri,
				name: result.name || "uploaded_file.png",
				type: result.mimeType || "image/png",
			});

      const response = await fetch(
				`http://${localhost}:3000/api/warden/uploadmessmenu`,
				{
					method: "POST",
					body: fileData,
					headers: {
						"Content-Type": "multipart/form-data",
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				const errorDetails = await response.text();
				throw new Error(errorDetails);
			}

			Alert.alert("Success", "Mess menu uploaded successfully.");
			getMessMenu(); // Refresh the menu after upload
		} catch (error) {
			console.error("Upload failed:", error.message || error);
			Alert.alert("Error", "Failed to upload the mess menu.");
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		getMessMenu();
	}, []);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	if (!imageUri) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.errorText}>
					Failed to fetch the Mess Menu.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Mess Menu</Text>
			<Image source={{ uri: imageUri }} style={styles.image} />
			<TouchableOpacity
				style={styles.downloadButton}
				onPress={downloadMenu}
			>
				<Text style={styles.downloadButtonText}>Download Menu</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.uploadButton} onPress={uploadMenu}>
				<Text style={styles.uploadButtonText}>Upload Menu</Text>
			</TouchableOpacity>
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
	errorText: {
		color: "#ff3333",
		fontSize: 16,
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
});
