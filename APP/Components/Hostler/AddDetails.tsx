import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../Store/Store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";

const AddDetails = () => {
	const { localhost, cookie } = useStore();
	const navigation = useNavigation<any>();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [formData, setFormData] = useState({
		date_of_birth: "",
		blood_group: "",
		local_guardian: "",
		local_guardian_phone: "",
		local_guardian_address: "",
		fathers_no: "",
		mothers_no: "",
		fathers_email: "",
		mothers_email: "",
		course: "",
		branch: "",
	});
	const [loading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const handleInputChange = (key: string, value: string) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleSubmit = async () => {
		setLoading(true);

		const {
			date_of_birth,
			blood_group,
			local_guardian,
			local_guardian_phone,
			local_guardian_address,
			fathers_no,
			mothers_no,
			fathers_email,
			mothers_email,
			course,
			branch,
		} = formData;

		if (
			!date_of_birth ||
			!blood_group ||
			!local_guardian ||
			!local_guardian_phone ||
			!local_guardian_address ||
			!fathers_no ||
			!mothers_no ||
			!fathers_email ||
			!mothers_email ||
			!course ||
			!branch
		) {
			setAlertMessage("Please fill all required fields.");
			setAlert(true);
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				`${localhost}/api/hostler/adddetails`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(formData),
				}
			);

			const result = await response.json();

			if (response.ok) {
				setSuccessMessage("Details added successfully!");
				setSuccess(true);
				navigation.replace("Hosteller"); // Go back to the previous screen
			} else {
				setAlertMessage(result.message || "Failed to add details.");
				setAlert(true);
			}
		} catch (error) {
			console.error("Error adding details: ", error);
			setAlertMessage("Failed to add details.");
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (event: any, date: Date | undefined) => {
		setShowDatePicker(false);
		if (date) {
			setSelectedDate(date);
			handleInputChange(
				"date_of_birth",
				date.toISOString().split("T")[0] // Format as YYYY-MM-DD
			);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Add Details</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Date of Birth</Text>
				<TouchableOpacity
					style={styles.datePickerButton}
					onPress={() => setShowDatePicker(true)}
				>
					<Text style={styles.datePickerText}>
						{selectedDate
							? selectedDate.toDateString()
							: "Select Date of Birth"}
					</Text>
				</TouchableOpacity>
				{showDatePicker && (
					<DateTimePicker
						value={selectedDate || new Date()}
						mode="date"
						display="default"
						onChange={handleDateChange}
					/>
				)}
			</View>
			{/* Blood Group Picker */}
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Blood Group</Text>
				<Picker
					selectedValue={formData.blood_group}
					onValueChange={(itemValue) =>
						handleInputChange("blood_group", itemValue)
					}
				>
					<Picker.Item label="Select Blood Group" value="" />
					<Picker.Item label="A+" value="A+" />
					<Picker.Item label="B+" value="B+" />
					<Picker.Item label="O+" value="O+" />
					<Picker.Item label="AB+" value="AB+" />
					<Picker.Item label="A-" value="A-" />
					<Picker.Item label="B-" value="B-" />
					<Picker.Item label="O-" value="O-" />
					<Picker.Item label="AB-" value="AB-" />
				</Picker>
			</View>

			{/* Local Guardian Name */}
			<TextInput
				style={styles.input}
				placeholder="Local Guardian Name"
				value={formData.local_guardian}
				onChangeText={(value) =>
					handleInputChange("local_guardian", value)
				}
			/>

			<TextInput
				style={styles.input}
				placeholder="Local Guardian Phone"
				value={formData.local_guardian_phone}
				onChangeText={(value) =>
					handleInputChange("local_guardian_phone", value)
				}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Local Guardian Address"
				value={formData.local_guardian_address}
				onChangeText={(value) =>
					handleInputChange("local_guardian_address", value)
				}
			/>
			<TextInput
				style={styles.input}
				placeholder="Father's Phone Number"
				value={formData.fathers_no}
				onChangeText={(value) => handleInputChange("fathers_no", value)}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Mother's Phone Number"
				value={formData.mothers_no}
				onChangeText={(value) => handleInputChange("mothers_no", value)}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Father's Email"
				value={formData.fathers_email}
				onChangeText={(value) =>
					handleInputChange("fathers_email", value)
				}
				keyboardType="email-address"
			/>
			<TextInput
				style={styles.input}
				placeholder="Mother's Email"
				value={formData.mothers_email}
				onChangeText={(value) =>
					handleInputChange("mothers_email", value)
				}
				keyboardType="email-address"
			/>
			<TextInput
				style={styles.input}
				placeholder="Course"
				value={formData.course}
				onChangeText={(value) => handleInputChange("course", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Branch"
				value={formData.branch}
				onChangeText={(value) => handleInputChange("branch", value)}
			/>

			<View style={styles.buttonContainer}>
				<Button
					title="Add Details"
					onPress={handleSubmit}
					color="#2cb5a0"
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
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2cb5a0",
		textAlign: "center",
		marginBottom: 20,
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
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		padding: 10,
		marginVertical: 10,
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	inputContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	buttonContainer: {
		marginTop: 20,
	},
});

export default AddDetails;
