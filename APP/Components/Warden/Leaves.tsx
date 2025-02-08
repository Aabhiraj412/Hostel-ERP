import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import { RefreshControl } from "react-native-gesture-handler";

const Leaves = () => {
	const { localhost, cookie } = useStore();
	const [leaves, setLeaves] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedLeave, setSelectedLeave] = useState(null);
	const [studentDetails, setStudentDetails] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [filterStatus, setFilterStatus] = useState("All"); // State for filtering
	const [refreshing, setRefreshing] = useState(false);

	// Fetch leave applications
	const fetchLeaves = async () => {
		// setLoading(true);
		try {
			const response = await fetch(`${localhost}/api/warden/getleaves`, {
				headers: { Cookie: cookie },
			});
			const data = await response.json();
			setLeaves(data);
		} catch (error) {
			console.error("Error fetching leaves:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch student details
	const fetchStudentDetails = async (leaveId) => {
		try {
			const response = await fetch(
				`${localhost}/api/warden/getdetail/${leaveId}`,
				{
					headers: { Cookie: cookie },
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data.message || "Unable to fetch student details"
				);
			}
			setStudentDetails(data);
		} catch (error) {
			console.error("Error fetching student details:", error);
			setStudentDetails(null);
		}
	};

	// Update leave status
	const updateLeaveStatus = async (leaveId, status) => {
		setUpdating(true);
		try {
			const response = await fetch(
				`${localhost}/api/warden/setleave/${leaveId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify({ status }),
				}
			);

			const updatedLeave = await response.json();

			if (!response.ok) {
				throw new Error(
					updatedLeave.message ||
						"Failed to update leave status. Please try again."
				);
			}

			// Update the local state
			setLeaves((prevLeaves) =>
				prevLeaves.map((leave) =>
					leave._id === leaveId ? updatedLeave : leave
				)
			);
			setSelectedLeave(null); // Close modal after updating
		} catch (error) {
			console.error("Error updating leave status:", error);
		} finally {
			setUpdating(false);
		}
	};

	useEffect(() => {
		fetchLeaves();
	}, []);

	useEffect(() => {
		if (selectedLeave) {
			fetchStudentDetails(selectedLeave.student);
		}
	}, [selectedLeave]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchLeaves();
		setRefreshing(false);
	}

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
			<Text style={styles.statusText}>
				Status:{" "}
				<Text
					style={{
						color:
							item.status === "Pending"
								? "orange"
								: item.status === "Approved"
								? "green"
								: "red",
					}}
				>
					{item.status}
				</Text>
			</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{/* Filter Buttons */}
			<View style={styles.filterContainer}>
				{["All", "Pending", "Approved", "Rejected"].map((status) => (
					<TouchableOpacity
						key={status}
						style={[
							styles.filterButton,
							filterStatus === status && styles.activeFilter,
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
				))}
			</View> 

			{/* Leave List */}
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
						<Text style={styles.empty}>No leave applications</Text>
					}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				/>
			)}

			{/* Modal for Leave Details */}
			{selectedLeave && (
				<Modal transparent={true} animationType="slide">
					<TouchableWithoutFeedback
						onPress={() => {setStudentDetails(null); setSelectedLeave(null)}}
					>
						<View style={styles.modalContainer}>
							<TouchableWithoutFeedback>
								<View style={styles.modalContent}>
									<Text style={styles.modalTitle}>
										Leave Details
									</Text>
									<Text style={styles.modalText}>
										Student Name:{" "}
										{studentDetails?.name || "Loading..."}
									</Text>
									<Text style={styles.modalText}>
										Hostel:{" "}
										{studentDetails?.hostel || "Loading..."}
									</Text>
									<Text style={styles.modalText}>
										Room No:{" "}
										{studentDetails?.room_no ||
											"Loading..."}
									</Text>
									<Text style={styles.modalText}>
										Reason: {selectedLeave.reason}
									</Text>
									<Text style={styles.modalText}>
										From:{" "}
										{new Date(
											selectedLeave.from
										).toLocaleDateString()}
									</Text>
									<Text style={styles.modalText}>
										To:{" "}
										{new Date(
											selectedLeave.to
										).toLocaleDateString()}
									</Text>
									<Text style={styles.modalText}>
										No of Days: {selectedLeave.days}
									</Text>
									<Text style={styles.modalText}>
										Status: {selectedLeave.status}
									</Text>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<Text style={styles.modalText}>
											Parents Contact:{" "}
										</Text>
										<TouchableOpacity
											onPress={() =>
												Linking.openURL(
													`tel:${selectedLeave?.contact_no}`
												)
											}
										>
											<Text
												style={styles.modalcontactText}
											>
												{selectedLeave?.contact_no}
											</Text>
										</TouchableOpacity>
									</View>

									{updating ? (
										<View style={styles.loadingContainer}>
											<ActivityIndicator
												size="large"
												color="#2cb5a0"
											/>
										</View>
									) : (
										<View>
											{selectedLeave?.status ===
												"Pending" && (
												<View
													style={
														styles.buttonContainer
													}
												>
													<TouchableOpacity
														style={
															styles.approveButton
														}
														onPress={() =>
															updateLeaveStatus(
																selectedLeave._id,
																"Approved"
															)
														}
														disabled={updating}
													>
														<Text
															style={
																styles.buttonText
															}
														>
															Approve
														</Text>
													</TouchableOpacity>
													<TouchableOpacity
														style={
															styles.rejectButton
														}
														onPress={() =>
															updateLeaveStatus(
																selectedLeave._id,
																"Rejected"
															)
														}
														disabled={updating}
													>
														<Text
															style={
																styles.buttonText
															}
														>
															Reject
														</Text>
													</TouchableOpacity>
												</View>
											)}
										</View>
									)}
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			)}
		</View>
	);
};

export default Leaves;

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
	statusText: {
		fontSize: 14,
		fontWeight: "bold",
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
	callButton: {
		width: "45%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: 20,
	},
	modalcontactText: {
		fontSize: 18,
		color: "#2cb5a0",
		fontWeight: "bold",
		letterSpacing: 0.5,
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
