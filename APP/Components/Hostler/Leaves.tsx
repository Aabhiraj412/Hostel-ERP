import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import DateTimePicker from "@react-native-community/datetimepicker";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";
import { RefreshControl } from "react-native-gesture-handler";

const HLeaves = () => {
	const { localhost, cookie } = useStore();
	const [leaves, setLeaves] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedLeave, setSelectedLeave] = useState(null);
	const [applyingLeave, setApplyingLeave] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(
		null
	);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [leaveDetails, setLeaveDetails] = useState({
		days: "",
		from: "",
		to: "",
		reason: "",
		address: "",
		contact_no: "",
	});
	const [filterStatus, setFilterStatus] = useState("All"); // State for filtering
	const [refreshing, setRefreshing] = useState(false);

	const fetchLeaves = async () => {
		try {
			const response = await fetch(`${localhost}/api/Hostler/getleaves`, {
				headers: { Cookie: cookie },
			});
			const data = await response.json();
			const sortedLeaves = data.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			);

			setLeaves(sortedLeaves);
		} catch (error) {
			console.error("Error fetching leaves:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (
		event: React.SyntheticEvent<unknown>,
		date?: Date
	) => {
		setShowDatePicker(null);

		if (date) {
			const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
			setSelectedDate(date);

			// Dynamically update either "from" or "to"
			setLeaveDetails((prevDetails) => ({
				...prevDetails,
				from: formattedDate,
			}));
		}
	};

	const applyLeave = async () => {
		const { days, from, to, reason, address, contact_no } = leaveDetails;

		if (!days || !from || !to || !reason || !address || !contact_no) {
			setAlertMessage("Please fill all the fields.");
			setAlert(true);
			return;
		}

		// Convert dates to JavaScript Date objects
		const fromDate = new Date(from);
		const toDate = new Date(to);

		// Calculate the difference in days
		const dayDifference =
			Math.ceil(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			) + 1;

		if (dayDifference !== parseInt(days)) {
			setAlertMessage("Please Provide the Correct Number of Days.");
			setAlert(true);
			return;
		}

		setApplyingLeave(false);
		setProcessing(true);

		try {
			const response = await fetch(
				`${localhost}/api/hostler/applyleave`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(leaveDetails),
				}
			);
			if (!response.ok) throw new Error("Failed to apply for leave.");
			const newLeave = await response.json();
			setLeaves((prevLeaves) => [newLeave, ...prevLeaves]);
		} catch (error) {
			setAlertMessage(error.message);
			setAlert(true);
		} finally {
			setLeaveDetails({
				days: "",
				from: "",
				to: "",
				reason: "",
				address: "",
				contact_no: "",
			});
			setProcessing(false);
		}
	};

	useEffect(() => {
		fetchLeaves();
	}, []);

	useEffect(() => {}, [selectedLeave]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchLeaves();
		setRefreshing(false);
	};

	// Function to filter leaves based on the selected status
	const filterLeaves = () => {
		if (filterStatus === "All") return leaves;
		return leaves.filter((leave) => leave.status === filterStatus);
	};

	const renderLeave = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => setSelectedLeave(item)}
		>
			<Text style={styles.text}>Reason: {item.reason}</Text>
			<Text style={styles.text}>
				From: {new Date(item.from).toLocaleDateString()}
			</Text>
			<Text style={styles.text}>
				To: {new Date(item.to).toLocaleDateString()}
			</Text>
			<View
				style={[
					styles.statusContainer,
					{
						backgroundColor:
							item.status === "Pending"
								? "#FFA726"
								: item.status === "Approved"
								? "#66BB6A"
								: "#EF5350",
					},
				]}
			>
				<Text style={styles.statusText}>{item.status}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<View style={styles.filterContainer}>
					{["All", "Pending", "Approved", "Rejected"].map(
						(status) => (
							<TouchableOpacity
								key={status}
								style={[
									styles.filterButton,
									filterStatus === status &&
										styles.activeFilter,
								]}
								onPress={() => setFilterStatus(status)}
							>
								<Text
									style={[
										styles.filterText,
										filterStatus === status &&
											styles.activeFilterText,
									]}
								>
									{status}
								</Text>
							</TouchableOpacity>
						)
					)}
				</View>

				{loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#2cb5a0" />
					</View>
				) : (
					<FlatList
						data={filterLeaves()}
						keyExtractor={(item) => item._id}
						renderItem={renderLeave}
						contentContainerStyle={styles.list}
						ListEmptyComponent={
							<Text style={styles.empty}>
								No leave applications
							</Text>
						}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
							/>
						}
					/>
				)}

				<TouchableOpacity
					style={styles.applyButton}
					onPress={() => setApplyingLeave(true)}
				>
					<Text style={styles.applyButtonText}>Apply for Leave</Text>
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

				{/* Apply for Leave Modal */}
				<Modal
					visible={applyingLeave}
					animationType="slide"
					transparent={true}
					onRequestClose={() => setApplyingLeave(false)}
				>
					<TouchableWithoutFeedback
						onPress={() => setApplyingLeave(false)}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>
									Apply for Leave
								</Text>
								<TextInput
									style={styles.input}
									placeholder="No of Days"
									keyboardType="numeric"
									value={leaveDetails.days}
									onChangeText={(text) =>
										setLeaveDetails({
											...leaveDetails,
											days: text,
										})
									}
								/>
								<Text style={styles.label}>From</Text>
								<TouchableOpacity
									style={styles.datePickerButton}
									onPress={() => setShowDatePicker("from")}
								>
									<Text style={styles.datePickerText}>
										{leaveDetails.from ||
											"Select Start Date"}
									</Text>
								</TouchableOpacity>

								<Text style={styles.label}>To</Text>
								<TouchableOpacity
									style={styles.datePickerButton}
									onPress={() => setShowDatePicker("to")}
								>
									<Text style={styles.datePickerText}>
										{leaveDetails.to || "Select End Date"}
									</Text>
								</TouchableOpacity>

								{showDatePicker && (
									<DateTimePicker
										value={selectedDate}
										mode="date"
										display="default"
										onChange={(event, date) => {
											setShowDatePicker(null); // Close picker
											if (date) {
												const formattedDate = date
													.toISOString()
													.split("T")[0];
												setLeaveDetails(
													(prevDetails) => ({
														...prevDetails,
														[showDatePicker]:
															formattedDate, // Dynamically set 'from' or 'to'
													})
												);
											}
										}}
									/>
								)}
								<TextInput
									style={styles.input}
									placeholder="Reason for Leave"
									value={leaveDetails.reason}
									onChangeText={(text) =>
										setLeaveDetails({
											...leaveDetails,
											reason: text,
										})
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="Leave Address"
									value={leaveDetails.address}
									onChangeText={(text) =>
										setLeaveDetails({
											...leaveDetails,
											address: text,
										})
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="Contact Number"
									keyboardType="phone-pad"
									value={leaveDetails.contact_no}
									onChangeText={(text) =>
										setLeaveDetails({
											...leaveDetails,
											contact_no: text,
										})
									}
								/>

								<View style={styles.buttonContainer}>
									{processing ? (
										<ActivityIndicator
											size="large"
											color="#2cb5a0"
										/>
									) : (
										<TouchableOpacity
											style={styles.submitButton}
											onPress={applyLeave}
										>
											<Text
												style={styles.submitButtonText}
											>
												Submit
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				{/* Leave Details Modal */}
				<Modal
					visible={!!selectedLeave}
					animationType="fade"
					transparent={true}
				>
					<TouchableWithoutFeedback
						onPress={() => setSelectedLeave(null)}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>
									Leave Details
								</Text>
								<Text style={styles.modalText}>
									Reason: {selectedLeave?.reason}
								</Text>
								<Text style={styles.modalText}>
									From:{" "}
									{new Date(
										selectedLeave?.from
									).toLocaleDateString()}
								</Text>
								<Text style={styles.modalText}>
									To:{" "}
									{new Date(
										selectedLeave?.to
									).toLocaleDateString()}
								</Text>
								<Text style={styles.modalText}>
									No of Days: {selectedLeave?.days}
								</Text>
								<Text style={styles.modalText}>
									Contact: {selectedLeave?.contact_no}
								</Text>
								<Text style={styles.modalText}>
									Address: {selectedLeave?.address}
								</Text>
								<View
									style={[
										styles.statusContainer,
										{
											backgroundColor:
												selectedLeave?.status ===
												"Pending"
													? "#FFA726"
													: selectedLeave?.status ===
													  "Approved"
													? "#66BB6A"
													: "#EF5350",
										},
									]}
								>
									<Text style={styles.statusText}>
										Status: {selectedLeave?.status}
									</Text>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default HLeaves;

const styles = StyleSheet.create({
	applyButton: {
		backgroundColor: "#2cb5a0",
		borderRadius: 10,
		padding: 15,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
		marginVertical: 10,
	},
	label: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	datePickerButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#2cb5a0",
		borderRadius: 8,
		marginBottom: 16,
		alignItems: "center",
	},
	datePickerText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	applyButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	statusContainer: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 8,
		marginTop: 10,
		textAlign: "center",
		// alignSelf: "center",
	},
	statusText: {
		textAlign: "center",
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	container: {
		flex: 1,
		backgroundColor: "#f0f4f7",
		padding: 10,
	},
	list: {
		paddingBottom: 20,
	},
	loadingContainer: {
		margin: 50,
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
	text: {
		fontSize: 14,
		color: "#333",
		marginBottom: 5,
	},
	empty: {
		textAlign: "center",
		fontSize: 16,
		color: "#aaa",
		marginTop: 50,
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
	approveButton: {
		backgroundColor: "green",
		padding: 10,
		borderRadius: 5,
		width: "45%",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		width: "100%",
	},
	rejectButton: {
		backgroundColor: "red",
		padding: 10,
		borderRadius: 5,
		width: "45%",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	submitButton: {
		flex: 1,
		backgroundColor: "#2cb5a0",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	submitButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	filterContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
	},
	filterButton: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#2cb5a0",
	},
	activeFilter: {
		backgroundColor: "#2cb5a0",
	},
	filterText: {
		color: "#2cb5a0",
		fontWeight: "bold",
	},
	activeFilterText: {
		color: "#fff",
	},
});
