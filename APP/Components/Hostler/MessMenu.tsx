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
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import useStore from "../../Store/Store";

const HMessMenu = () => {
	const { localhost, cookie } = useStore();
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const blobToBase64 = (blob: Blob): Promise<string> => {
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
				`http://${localhost}:3000/api/warden/getmessmenu`,
				{
					method: "GET",
					headers: {
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				throw new Error(
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
			Alert.alert("Error", "Failed to fetch the mess menu.");
		} finally {
			setLoading(false);
		}
	};

	const downloadMenu = async () => {
		if (!imageUri) {
			Alert.alert("Error", "No menu available to download.");
			return;
		}

		try {
			// Request permissions to save files to the gallery
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Permission Denied",
					"Cannot save to gallery without permissions."
				);
				return;
			}

			// Download the image from the server to the app's cache directory
			const downloadPath = `${FileSystem.cacheDirectory}mess_menu.png`;
			const { uri } = await FileSystem.downloadAsync(
				`http://${localhost}:3000/api/warden/getmessmenu`,
				downloadPath
			);

			// Save the downloaded file to the gallery
			const asset = await MediaLibrary.createAssetAsync(uri);
			await MediaLibrary.createAlbumAsync("Download", asset, false);

			Alert.alert("Success", `Menu saved to your gallery.`);
		} catch (error) {
			console.error("Error saving file to gallery:", error);
			Alert.alert("Error", "Failed to save the menu to your gallery.");
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
		</View>
	);
};

export default HMessMenu;

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
