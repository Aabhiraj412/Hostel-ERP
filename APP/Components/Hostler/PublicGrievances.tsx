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
	Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";

const PrivateGrievances = () => {
	const { localhost, cookie, data } = useStore();
	const [grievances, setGrievances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedGrievance, setSelectedGrievance] = useState(null);
	const [addingGrievance, setAddingGrievance] = useState(false);
	const [adding, setAdding] = useState(false);
	const [upvoting, setUpvoting] = useState(false);
	const [grievanceDetails, setGrievanceDetails] = useState({
		title: "",
		description: "",
	});

	// Fetch grievances
	const fetchGrievances = async () => {
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/getpublicgrievance`,
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

	const upvote = async () => {
		setUpvoting(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/publicgrievance/upvote/${selectedGrievance._id}`,
				{
					method: "GET",
					headers: { Cookie: cookie },
				}
			);
			if (!response.ok) throw new Error("Failed to upvote.");
			const updatedGrievance = await response.json();
			setGrievances((prev) =>
				prev.map((grievance) =>
					grievance._id === updatedGrievance._id
						? updatedGrievance
						: grievance
				)
			);
			// Also update the selected grievance so the modal reflects the updated data
			setSelectedGrievance(updatedGrievance);
		} catch (error) {
			console.error("Error upvoting:", error);
		} finally {
			setUpvoting(false);
		}
	};
	// Add grievance
	const addGrievance = async () => {
		const { title, description } = grievanceDetails;
		if (!title || !description) {
			Alert.alert("Error", "Please fill all fields.");
			return;
		}
		setAdding(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/publicgrievance`,
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
			setGrievances((prev) => [newGrievance, ...prev]); // Add at the start
			setAddingGrievance(false);
			setGrievanceDetails({ title: "", description: "" });
		} catch (error) {
			Alert.alert("Error", error.message);
		} finally {
			setAdding(false);
		}
	};

	useEffect(() => {
		fetchGrievances();
	}, []);

	const renderGrievance = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => setSelectedGrievance(item)}
		>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.description}>{item.description}</Text>
			<Text style={styles.upvotes}>{item.upvotes.length} Upvotes</Text>
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
			{loading ? (
				<ActivityIndicator size="large" color="#2cb5a0" />
			) : (
				<FlatList
					data={grievances}
					keyExtractor={(item) => item._id}
					renderItem={renderGrievance}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						<Text style={styles.empty}>No private grievances</Text>
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
										Upvotes:{" "}
										{selectedGrievance.upvotes.length}
									</Text>
									<Text style={styles.modalText}>
										Status:{" "}
										<Text
											style={{
												color:
													selectedGrievance.status ===
													"Pending"
														? "orange"
														: selectedGrievance.status ===
														  "Resolved"
														? "green"
														: "red",
											}}
										>
											{selectedGrievance.status}
										</Text>
									</Text>
									{upvoting ? (
										<ActivityIndicator
											size="large"
											color="#2cb5a0"
										/>
									) : (
										<TouchableOpacity
											style={styles.button}
											onPress={upvote}
										>
											<Text style={styles.btntext}>
												{selectedGrievance.upvotes.includes(
													data._id
												)
													? "Remove Up Vote"
													: "Up Vote"}
											</Text>
										</TouchableOpacity>
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
	button: {
		backgroundColor: "#2cb5a0",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	btntext: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
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
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
	},
	description: {
		fontSize: 14,
		color: "#555",
		marginBottom: 5,
	},
	upvotes: {
		fontSize: 14,
		color: "#555",
		marginBottom: 5,
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
});
