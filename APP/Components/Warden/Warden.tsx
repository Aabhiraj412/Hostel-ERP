import React, { useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import useStore from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import SuccessAlert from "../Components/SuccessAlert";
import ErrorAlert from "../Components/ErrorAlert";
import { ActivityIndicator } from "react-native";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Warden() {
	const { data, localhost, setCookie, setUser, setData, cookie } = useStore();
	const navigation = useNavigation<any>(); // Use navigation hook with any type
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [logout, setLogout] = useState(false);
	const [loggingout, setLoggingout] = useState(false);
	const [pass, setPass] = useState(false);
	const [password, setPassword] = useState("");
	const [conpass, setConpass] = useState("");
	const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
	const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
	const [error, setError] = useState<string | null>(null);
	
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

	const changePassword = async () => {
		if (!password || !conpass) {
			setError("Please enter both fields.");
			return;
		}

		if (password!== conpass) {
            setError("Passwords do not match.");
            return;
        }

		if (password.length<6){
			setError("Password must be atleast 6 characters long.");
			return;
		}

		setError(null); // Clear error if any
		setLoggingout(true); // Set logging out to true to show loading indicator

		try {
			const response = await fetch(
				`https://${localhost}/api/warden/resetpass`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie
					},
					body: JSON.stringify({
						password: password,
						confirm_password: conpass
					}),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || "Password change failed."
				);
			}

			setSuccessMessage("Password changed successfully.");
			setSuccess(true);
			setPass(false);
		}
		catch (error: any) {
			setError(error.message);
		}
		finally {
			setLoggingout(false);
		}
	};
	// Logout handler
	const Logout = async () => {
		setLoggingout(true); // Set logging out to true to show loading indicator
		try {
			const response = await fetch(
				`https://${localhost}/api/auth/wardenlogout`,
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

			if (!response.ok) {
				throw new Error(result.message);
			}

			// Clear stored cookie and navigate to home
			setCookie(null); // Clear cookie in store
			setData(null); // Clear data in store
			setUser(null); // Clear user in store

			// Alert.alert("Logout Successful", "You have been logged out.");
			navigation.reset({
				index: 0, // Set the index to 0 to make the new screen the first screen in the stack
				routes: [{ name: "Home" }], // Provide the name of the screen you want to navigate to
			});
		} catch (error: any) {
			console.error("Logout error:", error.message);
			setAlertMessage(
				"An error occurred while logging out. Please try again."
			);
			setAlert(true);
		} finally {
			setLoggingout(false);
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
				<Text style={styles.text}>
					Gender: {wardenData.gender === "male" ? "Male" : "Female"}
				</Text>
				<Text style={styles.text}>Hostel: {wardenData.hostel}</Text>
				<Text style={styles.text}>Post: {wardenData.post}</Text>
				<Text style={styles.text}>Address: {wardenData.address}</Text>
			</View>
			<TouchableOpacity
				style={styles.ForgetButton}
				onPress={() => setPass(true)}
			>
				<Text style={styles.logoutText}>Change Password</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={() => setLogout(true)}
			>
				<Text style={styles.logoutText}>Logout</Text>
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
			<Modal animationType="slide" transparent={true} visible={logout}>
				<TouchableWithoutFeedback onPress={() => setLogout(false)}>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Log Out</Text>

							<Text style={styles.modalText}>
								Are you sure you want to Logout?
							</Text>

							<View style={styles.modalButtonContainer}>
								{loggingout ? (
									<ActivityIndicator
										size="large"
										color="#e74c3c"
									/>
								) : (
									<TouchableOpacity
										style={styles.modalButton}
										onPress={Logout}
									>
										<Text style={styles.modalButtonText}>
											Confirm
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<Modal animationType="slide" transparent={true} visible={pass}>
				<TouchableWithoutFeedback onPress={() => setPass(false)}>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								Change Password
							</Text>

							<Text style={styles.modalText}>
								Please enter your new password:
							</Text>

							<View style={styles.inputContainer}>
								<TextInput
									style={styles.input}
									placeholder="New Password"
									secureTextEntry={!showPassword}
									value={password}
									onChangeText={setPassword}
								/>
								<TouchableOpacity
									onPress={() =>
										setShowPassword(!showPassword)
									}
								>
									<Ionicons
										name={
											showPassword
												? "eye-outline"
												: "eye-off-outline"
										}
										size={20}
										color="#888"
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.inputContainer}>
								<TextInput
									style={styles.input}
									placeholder="Confirm Password"
									secureTextEntry={!showConfirmPassword}
									value={conpass}
									onChangeText={setConpass}
								/>
								<TouchableOpacity
									onPress={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
								>
									<Ionicons
										name={
											showConfirmPassword
												? "eye-outline"
												: "eye-off-outline"
										}
										size={20}
										color="#888"
									/>
								</TouchableOpacity>
							</View>

							<View style={styles.modalButtonContainer}>
								{loggingout ? (
									<ActivityIndicator
										size="large"
										color="#2cb5a0"
									/>
								) : (
									<TouchableOpacity
										style={styles.changeButton}
										onPress={() => changePassword()}
									>
										<Text style={styles.modalButtonText}>
											Change Password
										</Text>
									</TouchableOpacity>
								)}
							</View>
							{error && <Text style={styles.error}>{error}</Text>}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
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
	error: {
		color: "red",
		textAlign: "center",
		fontSize: 16,
		marginTop: 10,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
	input: {
		flex: 1,
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	buttonContainer: {
		marginTop: 30,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		color: "red",
	},
	modalText: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
	modalButton: {
		flex: 1,
		marginTop: 10,
		backgroundColor: "#e74c3c",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	changeButton: {
		flex: 1,
		marginTop: 10,
		backgroundColor: "#2cb5a0",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "bold",
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
	ForgetButton: {
		backgroundColor: "#2cb5a0",
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
