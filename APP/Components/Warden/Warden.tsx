import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import useStore from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";

export default function Warden() {
	const { data, localhost, setCookie, setUser, setData } = useStore();
	const navigation = useNavigation<any>(); // Use navigation hook with any type

	const wardenData = data;

	// Check if wardenData is available
	if (!wardenData) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>
					No data available for the Warden.
				</Text>
			</View>
		);
	}

	// Logout handler
	const Logout = () => {
		Alert.alert(
			"Logout",
			"Are you sure you want to logout?",
			[
				{
					text: "No",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "Yes", onPress: () => logout() },
			],
			{ cancelable: false }
		);
	};

	const logout = async () => {
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/auth/wardenlogout`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Logout failed with status code: ${response.status}`
				);
			}

			const result = await response.json();
			console.log("Logout response:", result);

			// Clear stored cookie and navigate to home
			setCookie(null); // Clear cookie in store
			setData(null); // Clear data in store
			setUser(null); // Clear user in store

			// Alert.alert("Logout Successful", "You have been logged out.");
			navigation.reset({
				index: 0, // Set the index to 0 to make the new screen the first screen in the stack
				routes: [{ name: 'Home' }], // Provide the name of the screen you want to navigate to
			});
		} catch (error: any) {
			console.error("Logout error:", error.message);
			Alert.alert(
				"Logout Failed",
				"An error occurred while logging out. Please try again."
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Warden Details</Text>
			{/* Fixed the typo here */}
			<View style={styles.detailsContainer}>
				<Text style={styles.text}>Name: {wardenData.name}</Text>
				<Text style={styles.text}>Phone No.: {wardenData.phone}</Text>
				<Text style={styles.text}>Email: {wardenData.email}</Text>
				<Text style={styles.text}>Aadhar No.: {wardenData.aadhar}</Text>
				<Text style={styles.text}>Gender: {wardenData.gender === "male" ? "Male" : "Female"}</Text>
				<Text style={styles.text}>Hostel: {wardenData.hostel}</Text>
				<Text style={styles.text}>Post: {wardenData.post}</Text>
				<Text style={styles.text}>Address: {wardenData.address}</Text>
			</View>
			<TouchableOpacity style={styles.logoutButton} onPress={Logout}>
				<Text style={styles.logoutText}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#2cb5a0",
	},
	dashboardButton: {
		backgroundColor: "#2cb5a0", // Blue color for the button
		padding: 12,
		borderRadius: 5,
		marginBottom: 20,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	dashboardButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	detailsContainer: {
		alignSelf: "stretch",
		padding: 15,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 20,
	},
	text: {
		fontSize: 18,
		marginVertical: 6,
		color: "#444",
	},
	errorText: {
		fontSize: 18,
		color: "red",
		textAlign: "center",
	},
	logoutButton: {
		backgroundColor: "#e74c3c",
		padding: 12,
		borderRadius: 5,
		marginTop: 20,
		width: "100%",
		alignItems: "center",
	},
	logoutText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
