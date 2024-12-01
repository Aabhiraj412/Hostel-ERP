import { useState } from "react";
import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import useStore from "./Store/Store";
import Constants from "expo-constants";

export default function App() {
	const { setCookie, setUsername, cookie, username } = useStore();
	const [userId, setuserId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [responseData, setResponseData] = useState(null);
	const [error, setError] = useState(null);

	const postData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`http://10.0.34.46:3000/api/auth/wardenlogin`,
				// `http://${Constants.manifest2.extra.localhost}:3000/api/auth/wardenlogin`,
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

			const cookies = response.headers.get("set-cookie");

			if (cookies) setCookie(cookies);
			const data = await response.json(); // Parse the JSON response
			setResponseData(data); // Store the response data
		} catch (error) {
			setError(error.message); // Handle errors
		} finally {
			setLoading(false); // Stop loading
		}
	};

	const Logout = async () => {
		try {
			const response = await fetch(
				"http://10.0.34.46:3000/api/auth/wardenlogout",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);
			const cookies = response.headers.get("set-cookie");

			if (cookies) setCookie(cookies);

			const data = await response.json();

			console.log(data);
			console.log("Logged Out");
			setResponseData(null);
		} catch (error) {
			console.log(error);
		}
	};

	const getHostlers = async () => {
		try {
			const response = await fetch(
				"http://10.0.34.46:3000/api/warden/gethostlers",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);

			const data = await response.json();

			console.log(data);
			setResponseData(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			{!responseData && (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						padding: 20,
						width: "100%",
					}}
				>
					<Text
						style={{
							fontSize: 40,
							margin: 20,
							textAlign: "center",
						}}
					>
						Warden Login
					</Text>
					<Text
						style={{
							fontSize: 20,
							margin: 20,
							textAlign: "center",
						}}
					>
						Please enter your UserID and Password
					</Text>
					<TextInput
						placeholder="UserID"
						style={{
							borderColor: "black",
							borderWidth: 1,
							margin: 10,
							borderRadius: 5,
							fontSize: 20,
						}}
						onChangeText={(e) => setuserId(e)}
						value={userId}
					></TextInput>
					<TextInput
						placeholder="Password"
						style={{
							borderColor: "black",
							borderWidth: 1,
							margin: 10,
							borderRadius: 5,
							fontSize: 20,
						}}
						onChangeText={(e) => setPassword(e)}
						value={password}
					></TextInput>

					<Button title="Login" onPress={postData} />
				</View>
			)}

			{loading && <ActivityIndicator size="large" color="#0000ff" />}

			{error && <Text style={{ color: "red" }}>Error: {error}</Text>}

			{responseData && (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						padding: 20,
						width: "100%",
					}}
				>
					<Text
						style={{
							fontSize: 40,
							textAlign: "center",
							margin: 20,
						}}
					>
						Warden Details
					</Text>
					<View
						style={{
							flex: 0.5,
							width: "80%",
							justifyContent: "Center",
							alignContent: "center",
							marginLeft: "20%",
						}}
					>
						<Text style={{ fontSize: 20 }}>
							Name : {responseData.name}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Phone No. : {responseData.phone}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Email : {responseData.email}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Aadhar No. : {responseData.aadhar}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Gender : {responseData.gender}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Hostel : {responseData.hostel}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Post : {responseData.post}
						</Text>
						<Text style={{ fontSize: 20 }}>
							Address : {responseData.address}
						</Text>
					</View>
					<Button title="Logout" onPress={Logout} />
				</View>
			)}
			<Button title="Get Hostlers" onPress={getHostlers} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
