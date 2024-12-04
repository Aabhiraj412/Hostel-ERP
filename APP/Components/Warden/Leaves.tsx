import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import useStore from "../../Store/Store";
  
  const Leaves = () => {
	const { localhost, cookie } = useStore();
	const [leaves, setLeaves] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedLeave, setSelectedLeave] = useState(null);
	const [updating, setUpdating] = useState(false);
  
	// Fetch leave applications
	const fetchLeaves = async () => {
	  try {
		const response = await fetch(
		  `http://${localhost}:3000/api/warden/getleaves`,
		  {
			headers: { Cookie: cookie },
		  }
		);
		const data = await response.json();
		setLeaves(data);
	  } catch (error) {
		console.error("Error fetching leaves:", error);
	  } finally {
		setLoading(false);
	  }
	};
  
	// Update leave status
	const updateLeaveStatus = async (leaveId, status) => {
	  setUpdating(true);
	  try {
		const response = await fetch(
		  `http://${localhost}:3000/api/warden/setleave/${leaveId}`,
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
			  <Text style={styles.empty}>No leave applications</Text>
			}
		  />
		)}
  
		{selectedLeave && (
		  <Modal transparent={true} animationType="slide">
			<TouchableWithoutFeedback onPress={() => setSelectedLeave(null)}>
			  <View style={styles.modalContainer}>
				<TouchableWithoutFeedback>
				  <View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Leave Details</Text>
					<Text style={styles.modalText}>
					  Reason: {selectedLeave.reason}
					</Text>
					<Text style={styles.modalText}>
					  From:{" "}
					  {new Date(selectedLeave.from).toLocaleDateString()}
					</Text>
					<Text style={styles.modalText}>
					  To: {new Date(selectedLeave.to).toLocaleDateString()}
					</Text>
					<Text style={styles.modalText}>
					  Days: {selectedLeave.days}
					</Text>
					<Text style={styles.modalText}>
					  Contact: {selectedLeave.contact_no}
					</Text>
					<Text style={styles.modalText}>
					  Address: {selectedLeave.address}
					</Text>
					<Text style={styles.modalText}>
					  Status: {selectedLeave.status}
					</Text>
  
					{updating ? (
					  <View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#2cb5a0" />
					  </View>
					) : (
					  <View style={styles.buttonContainer}>
						<TouchableOpacity
						  style={styles.approveButton}
						  onPress={() =>
							updateLeaveStatus(selectedLeave._id, "Approved")
						  }
						  disabled={updating}
						>
						  <Text style={styles.buttonText}>Approve</Text>
						</TouchableOpacity>
						<TouchableOpacity
						  style={styles.rejectButton}
						  onPress={() =>
							updateLeaveStatus(selectedLeave._id, "Rejected")
						  }
						  disabled={updating}
						>
						  <Text style={styles.buttonText}>Reject</Text>
						</TouchableOpacity>
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
	margin:50,
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
  });
  