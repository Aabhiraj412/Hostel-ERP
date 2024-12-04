import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	TextInput,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";

const HLeaves = () => {
	const { localhost, cookie } = useStore();
	const [leaves, setLeaves] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedLeave, setSelectedLeave] = useState(null);
	const [applyingLeave, setApplyingLeave] = useState(false);
  const [processing,setProcessing] = useState(false);
	const [leaveDetails, setLeaveDetails] = useState({
		days: "",
		from: "",
		to: "",
		reason: "",
		address: "",
		contact_no: "",
	});

	const fetchLeaves = async () => {
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/Hostler/getleaves`,
				{
					headers: { Cookie: cookie },
				}
			);
			const data = await response.json();
	  const sortedLeaves = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

			setLeaves(sortedLeaves);
		} catch (error) {
			console.error("Error fetching leaves:", error);
		} finally {
			setLoading(false);
		}
	};

	const applyLeave = async () => {
		const { days, from, to, reason, address, contact_no } = leaveDetails;
		if (!days || !from || !to || !reason || !address || !contact_no) {
			Alert.alert("Error", "Please fill all the fields.");
			return;
		}
		setApplyingLeave(false);
		setProcessing(true);

		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/applyleave`,
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
			Alert.alert("Error", error.message);
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
				{loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#2cb5a0" />
					</View>
				) : (
					<FlatList
						data={leaves}
						keyExtractor={(item) => item._id}
						renderItem={renderLeave}
						contentContainerStyle={styles.list}
						ListEmptyComponent={
							<Text style={styles.empty}>
								No leave applications
							</Text>
						}
					/>
				)}

				<TouchableOpacity
					style={styles.applyButton}
					onPress={() => setApplyingLeave(true)}
				>
					<Text style={styles.applyButtonText}>Apply for Leave</Text>
				</TouchableOpacity>

				{/* Apply for Leave Modal */}
				<Modal
					visible={applyingLeave}
					animationType="slide"
					transparent={true}
					onRequestClose={() => setApplyingLeave(false)}
				>
					<TouchableWithoutFeedback onPress={() => setApplyingLeave(false)}>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>Apply for Leave</Text>
								<TextInput
									style={styles.input}
									placeholder="No of Days"
									keyboardType="numeric"
									value={leaveDetails.days}
									onChangeText={(text) =>
										setLeaveDetails({ ...leaveDetails, days: text })
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="From (YYYY-MM-DD)"
									value={leaveDetails.from}
									onChangeText={(text) =>
										setLeaveDetails({ ...leaveDetails, from: text })
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="To (YYYY-MM-DD)"
									value={leaveDetails.to}
									onChangeText={(text) =>
										setLeaveDetails({ ...leaveDetails, to: text })
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="Reason for Leave"
									value={leaveDetails.reason}
									onChangeText={(text) =>
										setLeaveDetails({ ...leaveDetails, reason: text })
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="Leave Address"
									value={leaveDetails.address}
									onChangeText={(text) =>
										setLeaveDetails({ ...leaveDetails, address: text })
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
								
                {processing?
                  <ActivityIndicator size="large" color="#2cb5a0" />
                :	<TouchableOpacity
										style={styles.submitButton}
										onPress={applyLeave}
									>
										<Text style={styles.submitButtonText}>Submit</Text>
									</TouchableOpacity>}
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
					<TouchableWithoutFeedback onPress={() => setSelectedLeave(null)}>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>Leave Details</Text>
								<Text style={styles.modalText}>
									Reason: {selectedLeave?.reason}
								</Text>
								<Text style={styles.modalText}>
									From:{" "}
									{new Date(selectedLeave?.from).toLocaleDateString()}
								</Text>
								<Text style={styles.modalText}>
									To:{" "}
									{new Date(selectedLeave?.to).toLocaleDateString()}
								</Text>
								<Text style={styles.modalText}>
									Days: {selectedLeave?.days}
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
												selectedLeave?.status === "Pending"
													? "#FFA726"
													: selectedLeave?.status === "Approved"
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
});
