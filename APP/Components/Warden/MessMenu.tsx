import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Base64 } from "js-base64";  // Ensure base64 decoding
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
				throw new Error("Failed to load the mess menu.");
			}
	
			// Get the response as a Blob
			const blob = await response.blob();
	
			// Convert Blob to Base64
			const base64String = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result.split(',')[1]);
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
	
			// Construct the image URI with base64 data
			const imageUri = `data:image/png;base64,${base64String}`;
			setImageUri(imageUri);
	
		} catch (error) {
			console.error("Failed to load the mess menu.", error);
			setAlertMessage("Failed to fetch the mess menu.");
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};
	
    const uploadMenu = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/png",
                copyToCacheDirectory: true,
            });

            if (result.type === "cancel") return;

            const file = result.assets[0];

            setLoading(true);
            const formData = new FormData();

            formData.append("file", {
                uri: file.uri,
                name: "messmenu.png",
                type: "image/png",
            });

            const uploadResponse = await fetch(
                `https://${localhost}/api/warden/uploadmessmenu`,
                {
                    method: "POST",
                    headers: { Cookie: cookie },
                    body: formData,
                }
            );

            if (!uploadResponse.ok) throw new Error('Upload failed');

            setSuccessMessage('Mess menu successfully updated.');
            setSuccess(true);
            fetchMessMenu();
        } catch (uploadError) {
            console.error(uploadError.message);
            setAlertMessage('Upload Error.');
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
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                setAlertMessage("Cannot save to gallery without permissions.");
                setAlert(true);
                return;
            }

            const downloadPath = `${FileSystem.cacheDirectory}mess_menu.png`;
            await FileSystem.downloadAsync(`https://${localhost}/api/warden/getmessmenu`, downloadPath);

            const asset = await MediaLibrary.createAssetAsync(downloadPath);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
			
            setSuccessMessage("Menu saved to your gallery.");
            setSuccess(true);
        } catch (error) {
            console.error("Failed to save menu to gallery.");
            setAlertMessage("Failed to save menu to gallery.");
            setAlert(true);
        } finally {
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
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <Text style={styles.errorText}>No menu available</Text>
            )}

            <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadMenu}
            >
                <Text style={styles.downloadButtonText}>Download Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={uploadMenu}
            >
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
        padding: 16,
        alignItems: "center",
        flex: 1,
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
        borderWidth: 5,
        borderColor: "#2cb5a0",
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
