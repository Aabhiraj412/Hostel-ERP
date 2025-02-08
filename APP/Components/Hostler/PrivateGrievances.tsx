import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	TextInput,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import { RefreshControl } from "react-native-gesture-handler";
import SuccessAlert from "../Components/SuccessAlert";
import ErrorAlert from "../Components/ErrorAlert";

const PrivateGrievances = () => {
	const { localhost, cookie } = useStore();
	const [grievances, setGrievances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedGrievance, setSelectedGrievance] = useState(null);
	const [addingGrievance, setAddingGrievance] = useState(false);
	const [grievanceDetails, setGrievanceDetails] = useState({
		title: "",
		description: "",
	});
	const [adding, setAdding] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [filtered, setFiltered] = useState([]);
	const [filterStatus, setFilterStatus] = useState("All"); // State for filter
	const [refreshing, setRefreshing] = useState(false); // State for refresh control

	// Fetch grievances
	const fetchGrievances = async () => {
		try {
			const response = await fetch(
				`${localhost}/api/hostler/getprivategrievance`,
				{
					headers: { Cookie: cookie },
				}
			);
			const data = await response.json();
			setGrievances(data);
		} catch (error) {
			console.error("Error fetching grievances:", error);
		} finally {
			setLoading(false);
		}
	};

	// Add grievance
	const addGrievance = async () => {
		const { title, description } = grievanceDetails;
		if (!title || !description) {
			setAlertMessage("Please fill all fields.");
			setAlert(true);
			return;
		}
		setAdding(true);
		try {
			const response = await fetch(
				`${localhost}/api/hostler/privategrievance`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(grievanceDetails),
				}
			);

			if (!response.ok) throw new Error("Failed to add grievance.");

			const newGrievance = await response.json();
			//console.log(newGrievance);
			setGrievances((prev) => [newGrievance, ...prev]); // Add at the start
			setSuccessMessage("Grievance added successfully!");
			setSuccess(true);
			setAddingGrievance(false);
			setGrievanceDetails({ title: "", description: "" });
		} catch (error) {
			setAlertMessage("Failed to add grievance.");
			setAlert(true);
		} finally {
			setAdding(false);
		}
	};

	const filterChange = () => {
		if (filterStatus === "Pending") {
			const filtered = grievances.filter(
				(grievance) => grievance.status === "Pending"
			);
			setFiltered(filtered);
		} else if (filterStatus === "Cancelled") {
			const filtered = grievances.filter(
				(grievance) => grievance.status === "Cancelled"
			);
			setFiltered(filtered);
		} else if (filterStatus === "Resolved") {
			const filtered = grievances.filter(
				(grievance) => grievance.status === "Resolved"
			);
			setFiltered(filtered);
		} else {
			setFiltered(grievances);
		}
	};

	useEffect(() => {
		filterChange();
	}, [filterStatus, grievances]);

	useEffect(() => {
		fetchGrievances();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		fetchGrievances().then(() => setRefreshing(false));
	};

	const renderGrievance = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => setSelectedGrievance(item)}
		>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.description}>{item.description}</Text>
			<Text style={styles.date}>
				Date: {new Date(item.date).toLocaleDateString()}
			</Text>
			<Text style={styles.statusText}>
				Status:{" "}
				<Text
					style={{
						color:
							item.status === "Pending"
								? "orange"
								: item.status === "Resolved"
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
			<View style={styles.filterContainer}>
				{["All", "Pending", "Resolved", "Cancelled"].map((status) => (
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

			{loading ? (
				<View style={styles.loading}>
					<ActivityIndicator size="large" color="#2cb5a0" />
				</View>
			) : (
				<FlatList
					data={filtered}
					keyExtractor={(item) => item._id}
					renderItem={renderGrievance}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						<Text style={styles.empty}>No private grievances</Text>
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
				style={styles.addButton}
				onPress={() => setAddingGrievance(true)}
			>
				<Text style={styles.addButtonText}>Add Grievance</Text>
			</TouchableOpacity>

			{/* Add Grievance Modal */}
			<Modal
				visible={addingGrievance}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setAddingGrievance(false)}
			>
				<TouchableWithoutFeedback
					onPress={() => setAddingGrievance(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Add Grievance</Text>
							<TextInput
								style={styles.input}
								placeholder="Title"
								value={grievanceDetails.title}
								onChangeText={(text) =>
									setGrievanceDetails({
										...grievanceDetails,
										title: text,
									})
								}
							/>
							<TextInput
								style={styles.input}
								placeholder="Description"
								value={grievanceDetails.description}
								onChangeText={(text) =>
									setGrievanceDetails({
										...grievanceDetails,
										description: text,
									})
								}
								multiline={true}
							/>
							{adding ? (
								<ActivityIndicator
									size="large"
									color="#2cb5a0"
								/>
							) : (
								<View style={styles.buttonContainer}>
									<TouchableOpacity
										style={styles.submitButton}
										onPress={addGrievance}
									>
										<Text style={styles.submitButtonText}>
											Submit
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			{/* Grievance Details Modal */}
			{selectedGrievance && (
				<Modal transparent={true} animationType="slide">
					<TouchableWithoutFeedback
						onPress={() => setSelectedGrievance(null)}
					>
						<View style={styles.modalContainer}>
							<TouchableWithoutFeedback>
								<View style={styles.modalContent}>
									<Text style={styles.modalTitle}>
										Grievance Details
									</Text>
									<Text style={styles.modalText}>
										Title: {selectedGrievance.title}
									</Text>
									<Text style={styles.modalText}>
										Description:{" "}
										{selectedGrievance.description}
									</Text>
									<Text style={styles.modalText}>
										Date:{" "}
										{new Date(
											selectedGrievance.date
										).toLocaleDateString()}
									</Text>
									<Text style={styles.modalText}>
										Status: {selectedGrievance.status}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			)}
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

export default PrivateGrievances;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f4f7",
		padding: 10,
	},
	list: {
		paddingBottom: 20,
	},
	card: {
		backgroundColor: "#ffffff",
		padding: 15,
		borderRadius: 10,
		marginVertical: 10,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 3,
		borderLeftWidth: 5,
		borderLeftColor: "#2cb5a0",
	},
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
	},
	description: {
		fontSize: 14,
		color: "#555",
		marginBottom: 10,
	},
	date: {
		fontSize: 12,
		color: "#888",
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		width: "100%",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	submitButton: {
		backgroundColor: "#2cb5a0",
		padding: 10,
		borderRadius: 5,
		flex: 1,
		margin: 10,
	},
	submitButtonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	cancelButton: {
		backgroundColor: "red",
		padding: 10,
		borderRadius: 5,
		flex: 1,
		margin: 10,
	},
	cancelButtonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	addButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#2cb5a0",
		borderRadius: 30,
		padding: 15,
		elevation: 5,
	},
	addButtonText: {
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
