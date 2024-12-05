import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
	TextInput,
	Button,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import MiniCard from "../Components/MiniCard";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../Store/Store";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";

const HostlerDash = () => {
	const navigation = useNavigation<any>();
	const { localhost, cookie, data, setData } = useStore();
	const [loading, setLoading] = useState(false);
	const [check, setCheck] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
	const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
	const [modal, setModal] = useState(false);
	const [mark, setMark] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	
	const mycheck = () => {
		if (
			!data ||
			data.password === " " ||
			data.date_of_birth === " " ||
			data.blood_group === " " ||
			data.local_guardian === " " ||
			data.local_guardian_phone === " " ||
			data.local_guardian_address === " " ||
			data.fathers_no === " " ||
			data.mothers_no === " " ||
			data.fathers_email === " " ||
			data.mothers_email === " " ||
			data.course === " " ||
			data.branch === " "
		) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		if (data) {
			setCheck(mycheck());
		}
	}, [data]);

	const navigateTo = (route: string) => () => {
		if (route) {
			navigation.navigate(route);
		} else {
			setAlertMessage("Invalid navigation route");
			setAlert(true);
		}
	};

	const markAttendance = async () => {
		// Show the confirmation modal
		setMark(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/getip`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch IP address.");
			}

			const { ip } = await response.json();

			// Check if the IP address matches 'localhost'
			if (ip === localhost) {
				// Proceed to mark attendance
				const markResponse = await fetch(
					`http://${localhost}:3000/api/hostler/markattendance`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Cookie: cookie,
						},
					}
				);

				if (!markResponse.ok) {
					const fail = await markResponse.json();

					throw new Error(fail.message);
				}

				const markResult = await markResponse.json();
				setSuccessMessage(
					markResult.message || "Attendance marked successfully."
				);
				setSuccess(true);
			} else {
				setAlertMessage(
					"IP mismatch. Cannot mark attendance. Connect to Hostel Wi-Fi to Mark Attendance"
				);
				setAlert(true);
			}
		} catch (error) {
			setAlertMessage(error.message || "Something went wrong.");
			setAlert(true);
		} finally {
			setMark(false);
			setModal(false);
		}
	};

	const handleSubmitPassword = async () => {
		if (password !== confirmPassword) {
			setAlertMessage("Passwords do not match.");
			setAlert(true);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/setpass`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie || "",
					},
					body: JSON.stringify({
						password,
						confirm_password: confirmPassword,
					}),
				}
			);

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || "Failed to update password.");
			}

			setSuccessMessage(
				result.message || "Password updated successfully."
			);
			setSuccess(true);
			setModalVisible(false);
			setData(result);
		} catch (error) {
			setAlertMessage(error.message || "Something went wrong.");
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};

	const updatePassword = () => {
		setModalVisible(true);
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{check && (
						<View style={styles.row}>
							<MiniCard
								title="Add Details"
								onPress={navigateTo("Add Details")}
								IconComponent={({ size, color }) => (
									<Ionicons
										name="person-add-outline"
										size={size}
										color={color}
									/>
								)}
							/>
							<MiniCard
								title="Set Password"
								onPress={updatePassword}
								IconComponent={({ size, color }) => (
									<Ionicons
										name="lock-closed-outline"
										size={size}
										color={color}
									/>
								)}
							/>
						</View>
					)}

					<View style={styles.row}>
						<MiniCard
							title="Profile"
							onPress={navigateTo("Hostler")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="person-circle-outline"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Mark Attendance"
							onPress={() => setModal(true)}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="checkmark-done-outline"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>
					{/* Row 3: Leaves */}
					<View style={styles.row}>
						<MiniCard
							title="Leaves"
							onPress={navigateTo("Leaves ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="calendar-outline"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Out Register"
							onPress={navigateTo("Out Register ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="clipboard-outline"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 4: Grievances */}
					<View style={styles.row}>
						<MiniCard
							title="Public Grievances"
							onPress={navigateTo("Public Grievances ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="help-circle-outline"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Private Grievances"
							onPress={navigateTo("Private Grievances ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="lock-closed-outline"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 5: Mess Menu */}
					<View style={styles.row}>
						<MiniCard
							title="Mess Menu"
							onPress={navigateTo("Mess Menu ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="restaurant-outline"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Notices"
							onPress={navigateTo("Notices ")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="megaphone-outline"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

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

					<Modal
						visible={modalVisible}
						animationType="slide"
						transparent={true}
						onRequestClose={() => setModalVisible(false)}
					>
						<TouchableWithoutFeedback
							onPress={() => setModalVisible(false)}
						>
							<View style={styles.modalContainer}>
								<View style={styles.modalContent}>
									<Text style={styles.modalTitle}>
										Set Password
									</Text>
									<View style={styles.inputContainer}>
										<TextInput
											style={styles.input}
											placeholder="Enter Password"
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
											secureTextEntry={
												!showConfirmPassword
											}
											value={confirmPassword}
											onChangeText={setConfirmPassword}
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
									{loading ? (
										<ActivityIndicator
											size="large"
											color="#2cb5a0"
										/>
									) : (
										<View style={styles.buttonContainer}>
											<TouchableOpacity
												style={styles.submitButton}
												onPress={handleSubmitPassword}
											>
												<Text
													style={
														styles.submitButtonText
													}
												>
													Set Password
												</Text>
											</TouchableOpacity>
										</View>
									)}
								</View>
							</View>
						</TouchableWithoutFeedback>
					</Modal>
					<Modal
						visible={modal}
						animationType="slide"
						transparent={true}
						onRequestClose={() => setModal(false)}
					>
						<TouchableWithoutFeedback
							onPress={() => setModal(false)}
						>
							<View style={styles.modalContainer}>
								<View style={styles.modalContent}>
									<Text style={styles.modalTitle}>
										Mark Your Attendance
									</Text>

									<Text style={styles.modaltext}>
										Are you sure you want to mark your
										attendance?
									</Text>
									{mark ? (
										<ActivityIndicator
											size="large"
											color="#2cb5a0"
										/>
									) : (
										<View style={styles.buttonContainer}>
											<TouchableOpacity
												style={styles.submitButton}
												onPress={markAttendance}
											>
												<Text
													style={
														styles.submitButtonText
													}
												>
													Confirm
												</Text>
											</TouchableOpacity>
										</View>
									)}
								</View>
							</View>
						</TouchableWithoutFeedback>
					</Modal>
				</ScrollView>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 10,
	},
	scrollContent: {
		paddingVertical: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#2cb5a0",
	},
	submitButton: {
		backgroundColor: "#2cb5a0",
		padding: 10,
		borderRadius: 5,
		flex: 1,
	},
	submitButtonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	modaltext: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
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
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});

export default HostlerDash;
