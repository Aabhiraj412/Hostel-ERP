import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import useStore from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";

const PublishNotice = () => {
	const { localhost, cookie } = useStore();
	const navigation = useNavigation<any>();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleFilePick = async () => {
		try {
			const res = await DocumentPicker.getDocumentAsync({
				type: "*/*",
			});

			// Ensure that the assets array is not empty
			if (res.assets && res.assets.length > 0) {
				const file = res.assets[0]; // Access the first file in the assets array
				setFile({
					uri: file.uri,
					name: file.name || "unknown", // Handle cases where name is missing
					type: file.mimeType || "application/octet-stream", // Fallback for type
				});
			} else {
				console.log("File selection canceled.");
			}
		} catch (err) {
			console.error("Error selecting file:", err);
			Alert.alert("Error", "Failed to pick a file.");
		}
	};

	const handleSubmit = async () => {
		if (!title || !description || !file) {
			Alert.alert("Error", "Please fill all fields and upload a file.");
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("title", title);
			formData.append("description", description);
			formData.append("file", {
				uri: file.uri,
				name: file.name || "uploaded_file.pdf", // Fallback for missing file name
				type: file.mimeType || "application/pdf", // Fallback for missing MIME type
			});
			// Send the payload via fetch
			const response = await fetch(
				`http://${localhost}:3000/api/warden/uploadnotice`,
				{
					method: "POST",
					body: formData,
					headers: {
						"Content-Type": "multipart/form-data",
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				const errorDetails = await response.text();
				console.log("Error response from server:", errorDetails);
				throw new Error("Server error: " + errorDetails);
			}

			const responseData = await response.json();
			Alert.alert("Success", "Notice published successfully.");
			setTitle("");
			setDescription("");
			setFile(null);

			navigation.replace("Notices");
		} catch (error) {
			console.error("Upload failed:", error);
			Alert.alert(
				"Error",
				error.message || "An error occurred while uploading the notice."
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Publish Notice</Text>

			<TextInput
				placeholder="Title"
				value={title}
				onChangeText={setTitle}
				style={styles.input}
			/>
			<TextInput
				placeholder="Description"
				value={description}
				onChangeText={setDescription}
				style={[styles.input, styles.textArea]}
				multiline
				numberOfLines={4}
			/>

			<TouchableOpacity style={styles.btn} onPress={handleFilePick}>
				{file ? (
					<Text style={styles.fileText}>{file.name}</Text>
				) : (
					<Text style={styles.fileText}>Pick File</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity style={styles.btn} onPress={handleSubmit}>
				<Text style={styles.fileText}>PUBLISH NOTICE</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2cb5a0",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		width: "100%",
		padding: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 15,
		fontSize: 18,
	},
	textArea: {
		height: 100,
		textAlignVertical: "top",
	},
	fileText: {
		color: "#333",
		fontSize: 16,
		textAlign: "center",
	},
	btn: {
		backgroundColor: "#2cb5a0",
		width: "100%",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		marginBottom: 10,
		marginTop: 20,
	},
});

export default PublishNotice;
