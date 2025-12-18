import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
	TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import SuccessAlert from "../Components/SuccessAlert";
import ErrorAlert from "../Components/ErrorAlert";
import { RefreshControl } from "react-native-gesture-handler";

const HOutRegister = () => {
	const { localhost, cookie } = useStore();
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [close, setClose] = useState(false);
	const [open, setOpen] = useState(false);
	const [purpose, setPurpose] = useState(""); // For purpose input
	const [modalVisible, setModalVisible] = useState(false); // Modal state for opening entry
	const [selectedEntry, setSelectedEntry] = useState(null); // To store the entry to be closed
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	// Fetch out register entries
	const fetchEntries = async () => {
		try {
			const response = await fetch(`${localhost}/api/hostler/getentry`, {
				headers: { Cookie: cookie },
			});
			const data = await response.json();
			setEntries(data);
		} catch (error) {
			console.error("Error fetching entries:", error);
		} finally {
			setLoading(false);
		}
	};

	// Open a new entry
	const openEntry = async () => {
		if (!purpose.trim()) {
			setAlertMessage("Please provide a purpose.");
			setAlert(true);
			return;
		}

		setOpen(true); // Set loading state only if validation passes

		try {
			const body = JSON.stringify({ purpose });
			//console.log("Request body:", body);

			const response = await fetch(`${localhost}/api/hostler/openentry`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: body,
			});

			const result = await response.json();
			// Check if response is OK
			if (!response.ok) {
				throw new Error(
					result.message || "Failed to open entry. Please try again."
				);
			}

			setModalVisible(false);
			setPurpose("");
			// fetchEntries(); // Refresh the list
			setSuccessMessage("Entry opened successfully.");
			setEntries((prevEntries) => [result, ...prevEntries]);
		} catch (error) {
			// Log error for debugging
			console.error("Error in openEntry:", error);
			setAlertMessage(error.message);
			setAlert(true);
		} finally {
			setOpen(false); // Reset loading state
		}
	};

	// Close an existing entry
	const closeEntry = async (entryId) => {
		setClose(true); // Show the confirmation modal
		try {
			const response = await fetch(
				`${localhost}/api/hostler/closeentry`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);
			const result = await response.json();
			if (!response.ok)
				throw new Error(
					result.message || "Failed to close entry. Please try again."
				);
			setSelectedEntry(null); // Close the confirmation modal
			fetchEntries(); // Refresh the list
		} catch (error) {
			setAlertMessage(error.message);
			setAlert(true);
		} finally {
			setClose(false);
		}
	};

	// Confirm close entry
	const confirmCloseEntry = (entry) => {
		if (!entry.in_time) setSelectedEntry(entry);
	};

	useEffect(() => {
		fetchEntries();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		fetchEntries();
		setRefreshing(false);
	};

	const renderEntry = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => confirmCloseEntry(item)}
		>
			<Text style={styles.purpose}>Purpose: {item.purpose}</Text>
			<Text style={styles.text}>
				Out Time: {new Date(item.out_time).toLocaleString()}
			</Text>
			<Text
				style={[
					styles.text,
					!item.in_time && { color: "red", fontWeight: "bold" },
				]}
			>
				In Time:{" "}
				{item.in_time
					? new Date(item.in_time).toLocaleString()
					: "Not Returned"}
			</Text>
		</TouchableOpacity>
	);

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.container}>
				{loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#2cb5a0" />
					</View>
				) : (
					<>
						<FlatList
							data={entries}
							keyExtractor={(item) => item._id}
							renderItem={renderEntry}
							contentContainerStyle={styles.list}
							ListEmptyComponent={
								<Text style={styles.empty}>
									No entries found
								</Text>
							}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
						/>

						{/* Open Entry Button */}
						<TouchableOpacity
							style={styles.openButton}
							onPress={() => setModalVisible(true)}
						>
							<Text style={styles.openButtonText}>Going Out</Text>
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
						{/* Modal for Open Entry */}
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
											Open New Entry
										</Text>
										<TextInput
											style={styles.input}
											placeholder="Purpose"
											value={purpose}
											onChangeText={setPurpose}
										/>
										{open ? (
											<ActivityIndicator
												size="large"
												color="#2cb5a0"
											/>
										) : (
											<View
												style={styles.buttonContainer}
											>
												<TouchableOpacity
													style={styles.submitButton}
													onPress={openEntry}
												>
													<Text
														style={
															styles.submitButtonText
														}
													>
														Submit
													</Text>
												</TouchableOpacity>
											</View>
										)}
									</View>
								</View>
							</TouchableWithoutFeedback>
						</Modal>

						{/* Modal for Close Entry Confirmation */}
						<Modal
							visible={!!selectedEntry}
							animationType="fade"
							transparent={true}
							onRequestClose={() => setSelectedEntry(null)}
						>
							<TouchableWithoutFeedback
								onPress={() => setSelectedEntry(null)}
							>
								<View style={styles.modalContainer}>
									<View style={styles.modalContent}>
										<Text style={styles.modalTitle}>
											Close Entry Confirmation
										</Text>
										<Text style={styles.text}>
											Are you sure you want to close the
											entry for{" "}
											<Text style={styles.boldText}>
												{selectedEntry?.purpose}
											</Text>
											?
										</Text>

										{close ? (
											<View
												style={[
													styles.buttonContainer,
													{
														alignItems: "center",
														justifyContent:
															"center",
													},
												]}
											>
												<ActivityIndicator
													size="large"
													color="#2cb5a0"
												/>
											</View>
										) : (
											<View
												style={styles.buttonContainer}
											>
												<TouchableOpacity
													style={styles.submitButton}
													onPress={() =>
														closeEntry(
															selectedEntry?._id
														)
													}
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
					</>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

export default HOutRegister;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f4f7",
		padding: 10,
	},
	list: {
		paddingBottom: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		backgroundColor: "#ffffff",
		padding: 15,
		borderRadius: 15,
		marginVertical: 10,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
		borderLeftWidth: 5,
		borderLeftColor: "#2cb5a0",
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
	purpose: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 5,
		color: "#2cb5a0",
	},
	text: {
		fontSize: 14,
		color: "#333",
	},
	boldText: {
		fontWeight: "bold",
		marginBottom: 20,
	},
	empty: {
		textAlign: "center",
		fontSize: 16,
		color: "#aaa",
		marginTop: 50,
	},
	openButton: {
		backgroundColor: "#2cb5a0",
		padding: 15,
		borderRadius: 30,
		alignItems: "center",
		position: "absolute",
		bottom: 20,
		right: 20,
	},
	openButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		width: "100%",
	},
	buttonContainer: {
		marginTop: 30,
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
