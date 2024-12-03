import React, { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Alert,
} from "react-native";
import useStore from "../../Store/Store";
import { FontAwesome } from "@expo/vector-icons"; // Make sure you have expo installed

const HostlerLogin: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { setCookie, setUser, setData, localhost } = useStore();
	const [userId, setuserId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [passwordVisible, setPasswordVisible] = useState(false);

	const Login = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/auth/hostlerlogin`,
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
			navigation.replace("Hostler");
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
				<Text style={styles.subtitle}>Please enter your UserID and Password</Text>

				<TextInput
					placeholder="UserID"
					style={styles.input}
					onChangeText={(e) => setuserId(e)}
					value={userId}
				/>
				<View style={styles.passwordContainer}>
					<TextInput
						placeholder="Password"
						style={styles.input}
						secureTextEntry={!passwordVisible}
						onChangeText={(e) => setPassword(e)}
						value={password}
					/>
					<TouchableOpacity
						style={styles.eyeIcon}
						onPress={() => setPasswordVisible((prev) => !prev)}
					>
						<FontAwesome
							name={passwordVisible ? "eye-slash" : "eye"}
							size={24}
							color="gray"
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.loginButton} onPress={Login} disabled={loading}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>
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
