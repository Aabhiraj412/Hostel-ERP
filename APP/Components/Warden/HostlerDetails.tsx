import {
	Text,
	StyleSheet,
	View,
	Alert,
	Button,
	ActivityIndicator,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import useStore from "../../Store/Store";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

// Define the prop types for better type safety
interface HostlerDetailsProps {
	hostler: {
		name: string;
		roll_no: string;
		aadhar: string;
		gender: string;
		fathers_name: string;
		mothers_name: string;
		phone_no: string;
		email: string;
		address: string;
		year: string;
		college: string;
		hostel: string;
		room_no: string;
		[key: string]: any; // To allow for additional dynamic properties
	};
}

const HostlerDetails = () => {
	const { localhost, cookie } = useStore();
	const navigation = useNavigation<any>();
	const [hostel, setHostel] = useState(null);
	const [room, setRoom] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [remove, setRemove] = useState(false);

	const route =
		useRoute<
			RouteProp<{ HostlerDetails: HostlerDetailsProps }, "HostlerDetails">
		>();
	const { hostler } = route.params; // Access the hostler data

	// Check if hostlerData is available
	if (!hostler) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>
					No data available for the Hostler.
				</Text>
			</View>
		);
	}

	const changeRoom = async () => {
		try {
			setLoading(true);
			const req = await fetch(
				`https://${localhost}/api/warden/setroom/${hostler._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify({ hostel, room }),
				}
			);
			const response = await req.json();
			if (req.status === 200) {
				Alert.alert("Success", "Room changed successfully!");
			} else {
				Alert.alert(
					"Error",
					response.message || "Failed to change room."
				);
			}
		} catch (error) {
			console.error("Error changing room:", error);
			Alert.alert("Error", "Failed to change room.");
		} finally {
			setLoading(false);
			setModalVisible(false);
		}
	};

	const removeHostler = async () => {
		try {
			setLoading(true);
			const req = await fetch(
				`https://${localhost}/api/warden/removehostler/${hostler._id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);
			const response = await req.json();

			if (req.status === 200) {
				Alert.alert("Success", "Hostler removed successfully!");
				navigation.goBack();
			} else {
				Alert.alert(
					"Error",
					response.message || "Failed to remove hostler."
				);
			}
		} catch (error) {
			console.error("Error removing hostler:", error);
			Alert.alert("Error", "Failed to remove hostler.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Hostler Details</Text>

			<ScrollView>
				<View style={styles.detailsContainer}>
					<Text style={styles.text}>Name: {hostler.name}</Text>
					<Text style={styles.text}>
						Phone No.: {hostler.phone_no}
					</Text>
					<Text style={styles.text}>Email: {hostler.email}</Text>
					<Text style={styles.text}>
						Aadhar No.: {hostler.aadhar}
					</Text>
					<Text style={styles.text}>Roll No.: {hostler.roll_no}</Text>
					<Text style={styles.text}>
						Gender: {hostler.gender === "male" ? "Male" : "Female"}
					</Text>
					<Text style={styles.text}>Year: {hostler.year}</Text>
					<Text style={styles.text}>Course: {hostler.course}</Text>
					<Text style={styles.text}>Branch: {hostler.branch}</Text>
					<Text style={styles.text}>College: {hostler.college}</Text>
					<Text style={styles.text}>Hostel: {hostler.hostel}</Text>
					<Text style={styles.text}>Room No: {hostler.room_no}</Text>
					<Text style={styles.text}>
						No of days Present: {hostler.present_on.length}
					</Text>
<<<<<<< HEAD
					<Text style={styles.text}>
=======
					{/* <Text style={styles.text}>
>>>>>>> Abhiraj
						No of days Absent: {hostler.absent_on.length}
					</Text>
					<Text style={styles.text}>
						Attendance Percentage:{" "}
						{(
							(hostler.present_on.length * 100) /
							(hostler.present_on.length +
								hostler.absent_on.length)
						).toFixed(2)}
						%
<<<<<<< HEAD
					</Text>
=======
					</Text> */}
>>>>>>> Abhiraj
					<Text style={styles.text}>Address: {hostler.address}</Text>
					<Text style={styles.text}>
						DOB: {hostler.date_of_birth}
					</Text>
					<Text style={styles.text}>
						Blood Group: {hostler.blood_group}
					</Text>
					<Text style={styles.text}>
						Father's Name: {hostler.fathers_name}
					</Text>
					<Text style={styles.text}>
						Father's Phone No: {hostler.fathers_no}
					</Text>
					<Text style={styles.text}>
						Father's Email: {hostler.fathers_email}
					</Text>
					<Text style={styles.text}>
						Mother's Name: {hostler.mothers_name}
					</Text>
					<Text style={styles.text}>
						Mother's Phone No: {hostler.mothers_no}
					</Text>
					<Text style={styles.text}>
						Mother's Email: {hostler.mothers_email}
					</Text>
					<Text style={styles.text}>
						Local Guardian: {hostler.local_guardian}
					</Text>
					<Text style={styles.text}>
						Guardian's Phone No: {hostler.local_guardian_phone}
					</Text>
					<Text style={styles.text}>
						Guardian Address: {hostler.local_guardian_address}
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					<View style={{ marginBottom: 20 }}>
						<Button
							title="Change Room"
							onPress={() => setModalVisible(true)}
							color="#2cb5a0"
						/>
					</View>
					<View style={{ marginBottom: 20 }}>
						<Button
							title="Remove Hostler"
							onPress={() => setRemove(true)}
							color="#e74c3c"
						/>
					</View>
				</View>
			</ScrollView>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableWithoutFeedback
					onPress={() => setModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Change Room</Text>

							<View style={styles.inputContainer}>
								{/* <Text style={styles.label}>Hostel</Text> */}
								<View style={styles.dropdownContainer}>
									<Picker
										selectedValue={hostel}
										onValueChange={(value) =>
											setHostel(value)
										}
										style={{ width: 270 }}
									>
										<Picker.Item
											label="Select Hostel"
											value=""
										/>
										<Picker.Item
											label="Aryabhatt"
											value="Aryabhatt"
										/>
										<Picker.Item
											label="RN Tagore"
											value="RN Tagore"
										/>
										<Picker.Item
											label="Sarojni Naidu"
											value="Sarojni Naidu"
										/>
									</Picker>
								</View>
							</View>

							<TextInput
								style={styles.input}
								placeholder="Enter new Room Number"
								value={room}
								onChangeText={setRoom}
							/>
							{loading ? (
								<ActivityIndicator
									size="large"
									color="#2cb5a0"
								/>
							) : (
								<View style={styles.modalButtonContainer}>
									<TouchableOpacity
										style={styles.modalButton}
										onPress={changeRoom}
									>
										<Text style={styles.modalButtonText}>
											Submit
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<Modal
				animationType="slide"
				transparent={true}
				visible={remove}
				onRequestClose={() => setRemove(false)}
			>
				<TouchableWithoutFeedback onPress={() => setRemove(false)}>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								Remove Hostler
							</Text>

							<Text style={styles.modalText}>
								Are you sure you want to remove this hostler?
							</Text>

							{loading ? (
								<ActivityIndicator
									size="large"
									color="#e74c3c"
								/>
							) : (
								<View style={styles.modalButtonContainer}>
									<TouchableOpacity
										style={styles.modalRemove}
										onPress={removeHostler}
									>
										<Text style={styles.modalButtonText}>
											Remove Hostler
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	modalRemove: {
		flex: 1,
		backgroundColor: "#e74c3c",
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		alignItems: "center",
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
		color: "#e74c3c", // A pink color
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		marginVertical: 20,
		color: "#2cb5a0", // A fresh green color
		textAlign: "center",
	},
	detailsContainer: {
		alignSelf: "stretch",
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 6,
		marginBottom: 20,
		marginHorizontal: 10,
	},
	scrollContainer: {
		paddingBottom: 20,
	},
	text: {
		fontSize: 18,
		lineHeight: 24,
		marginVertical: 8,
		color: "#444",
		fontWeight: "500",
	},
	errorText: {
		fontSize: 20,
		color: "red",
		textAlign: "center",
		marginTop: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		marginTop: 20,
		width: "100%",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Darkened background to close modal
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#2cb5a0",
	},
	inputContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		color: "#444",
		marginBottom: 5,
	},
	dropdownContainer: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		backgroundColor: "#fff",
	},
	input: {
		width: "100%",
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	modalButton: {
		flex: 1,
		backgroundColor: "#2cb5a0",
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		alignItems: "center",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default HostlerDetails;
