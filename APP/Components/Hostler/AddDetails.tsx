import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	Alert,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../Store/Store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const AddDetails = () => {
	const { localhost, cookie } = useStore();
	const navigation = useNavigation<any>();

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
			Alert.alert("Error", "Please fill all required fields.");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/adddetails`,
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
				Alert.alert("Success", "Details added successfully!");
				navigation.replace("Hostler"); // Go back to the previous screen
			} else {
				Alert.alert(
					"Error",
					result.message || "Failed to add details."
				);
			}
		} catch (error) {
			console.error("Error adding details: ", error);
			Alert.alert("Error", "Failed to add details.");
		} finally {
			setLoading(false);
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
				<TextInput
					style={styles.input}
					placeholder="Date of Birth (DD-MM-YYYY)"
					value={formData.date_of_birth}
					onChangeText={(value) =>
						handleInputChange("date_of_birth", value)
					}
				/>
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
