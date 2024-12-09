import React, { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import useStore from "../../Store/Store";
import { FontAwesome } from "@expo/vector-icons";
import SuccessAlert from "../Components/SuccessAlert";

const HostlerLogin: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { setCookie, setUser, setData, localhost } = useStore();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [forerror, setForerror] = useState("");
	const [forgetting, setForgetting] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [forget, setForget] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const ForgetPass = () => {
		if (!userId) return setForerror("Please enter your UserID");

		setForgetting(true);

		fetch(`https://${localhost}/api/hostler/forgetpass`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: userId,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					const errorResponse = response.json();
					throw new Error(
						errorResponse.message ||
							"Failed to send password reset email."
					);
				}
				setForget(false);
				setSuccessMessage(
					"Your Temperory Password has been sent to your email."
				);
				setSuccess(true);
			})

			.catch((error) => {
				setForerror(error.message);
			})

			.finally(() => {
				setForgetting(false);
			});
	};

	const Login = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`https://${localhost}/api/auth/hostlerlogin`, // Consider using environment variables here
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user: userId,
						password: password,
					}),
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				if (errorResponse.message === "Invalid Credentials") {
					throw new Error("Invalid credentials. Please try again.");
				}
				throw new Error(
					`Login failed with status code: ${response.status}`
				);
			}

			const cookies = response.headers.get("set-cookie");

			if (cookies) setCookie(cookies);
			setUser("Hostler");

			const data = await response.json();
			setData(data);

			navigation.reset({
				index: 0,
				routes: [{ name: "Hostler Dashboard" }],
			});
		} catch (error: any) {
			setError(error.message); // Handle errors
		} finally {
			setLoading(false); // Stop loading
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
			<View style={styles.formContainer}>
				<Text style={styles.title}>Hostler Login</Text>
				<Text style={styles.subtitle}>
					Please enter your UserID and Password
				</Text>

				<TextInput
					placeholder="UserID"
					style={styles.input}
					onChangeText={(e) => setUserId(e)}
					value={userId}
					accessibilityLabel="Enter your User ID"
				/>
				<View style={styles.passwordContainer}>
					<TextInput
						placeholder="Password"
						style={styles.input}
						secureTextEntry={!passwordVisible}
						onChangeText={(e) => setPassword(e)}
						value={password}
						accessibilityLabel="Enter your Password"
					/>
					<TouchableOpacity
						style={styles.eyeIcon}
						onPress={() => setPasswordVisible((prev) => !prev)}
						accessibilityLabel="Toggle Password Visibility"
					>
						<FontAwesome
							name={passwordVisible ? "eye-slash" : "eye"}
							size={24}
							color="gray"
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={styles.loginButton}
					onPress={Login}
					disabled={loading}
					accessibilityLabel="Login Button"
				>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.loginButton}
					onPress={() => {
						setForget(true);
					}}
					disabled={loading}
					accessibilityLabel="Login Button"
				>
					<Text style={styles.buttonText}>Forget Password</Text>
				</TouchableOpacity>

				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>
			<Modal
				visible={forget}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setForget(false)}
			>
				<TouchableWithoutFeedback onPress={() => setForget(false)}>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								Forget Password
							</Text>
							<Text style={styles.modalText}>
								Please enter your UserID to receive a password
								reset link.
							</Text>
							<TextInput
								placeholder="UserID"
								style={styles.input}
								onChangeText={(e) => setUserId(e)}
								value={userId}
								accessibilityLabel="Enter your User ID"
							/>
							{forgetting ? (
								<ActivityIndicator
									size="large"
									color="#2cb5a0"
								/>
							) : (
								<TouchableOpacity
									style={styles.loginButton}
									onPress={ForgetPass}
									disabled={loading}
									accessibilityLabel="Reset Password Button"
								>
									<Text style={styles.buttonText}>
										Reset Password
									</Text>
								</TouchableOpacity>
							)}
							{forerror && (
								<Text style={styles.errorText}>{forerror}</Text>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<SuccessAlert
				message={successMessage}
				success={success}
				setSuccess={setSuccess}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#ffffff",
		padding: 20,
		borderRadius: 10,
		width: "80%",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
		color: "#2cb5a0",
	},
	modalText: {
		fontSize: 16,
		color: "#555",
		marginBottom: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	formContainer: {
		width: "80%",
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		color: "#2cb5a0",
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 18,
		textAlign: "center",
		color: "#555",
		marginBottom: 20,
	},
	input: {
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		fontSize: 18,
		marginBottom: 15,
		width: "100%",
	},
	passwordContainer: {
		position: "relative",
	},
	eyeIcon: {
		position: "absolute",
		right: 10,
		top: "35%",
		transform: [{ translateY: -12 }],
	},
	loginButton: {
		backgroundColor: "#2cb5a0",
		paddingVertical: 12,
		borderRadius: 5,
		width: "100%",
		alignItems: "center",
		marginBottom: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
	errorText: {
		color: "red",
		textAlign: "center",
		fontSize: 16,
		marginTop: 10,
	},
});

export default HostlerLogin;
