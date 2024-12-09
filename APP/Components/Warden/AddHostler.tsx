import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Button,
} from "react-native";
import useStore from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import ErrorAlert from "../Components/ErrorAlert";

const AddHostler = () => {
	const { localhost, cookie } = useStore();
	const navigation = useNavigation<any>();
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		roll_no: "",
		aadhar: "",
		gender: "",
		fathers_name: "",
		mothers_name: "",
		phone_no: "",
		email: "",
		address: "",
		year: "",
		college: "",
		hostel: "",
		room_no: "",
		password: "",
		confirm_password: "",
	});

	const handleInputChange = (key: string, value: string) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleSubmit = async () => {
		const {
			name,
			roll_no,
			aadhar,
			gender,
			fathers_name,
			mothers_name,
			phone_no,
			email,
			address,
			year,
			college,
			hostel,
			room_no,
			password,
			confirm_password,
		} = formData;

		if (!name || !roll_no || !email || !password || !confirm_password) {
			setAlertMessage("All required fields must be filled.");
			setAlert(true);
			return;
		}

		if (password !== confirm_password) {
			setAlertMessage("Passwords do not match.");
			setAlert(true);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/warden/addhostler`,
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
				navigation.replace("Hostler Details", { hostler: result });
			} else {
				setAlertMessage(result.message || "Failed to add hostler.");
				setAlert(true);
			}
		} catch (error) {
			console.error("Error adding hostler: ", error);
			setAlertMessage("Failed to add hostler.");
			setAlert(true);
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
			<Text style={styles.title}>Add Hostler</Text>
			<TextInput
				style={styles.input}
				placeholder="Name"
				value={formData.name}
				onChangeText={(value) => handleInputChange("name", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Roll Number"
				value={formData.roll_no}
				onChangeText={(value) => handleInputChange("roll_no", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Aadhar Number"
				value={formData.aadhar}
				onChangeText={(value) => handleInputChange("aadhar", value)}
				keyboardType="numeric"
			/>
			<TextInput
				style={styles.input}
				placeholder="Father's Name"
				value={formData.fathers_name}
				onChangeText={(value) =>
					handleInputChange("fathers_name", value)
				}
			/>
			<TextInput
				style={styles.input}
				placeholder="Mother's Name"
				value={formData.mothers_name}
				onChangeText={(value) =>
					handleInputChange("mothers_name", value)
				}
			/>
			<TextInput
				style={styles.input}
				placeholder="Phone Number"
				value={formData.phone_no}
				onChangeText={(value) => handleInputChange("phone_no", value)}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={formData.email}
				onChangeText={(value) => handleInputChange("email", value)}
				keyboardType="email-address"
			/>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Gender</Text>
				<View style={styles.genderContainer}>
					{["male", "female"].map((option) => (
						<TouchableOpacity
							key={option}
							style={[
								styles.genderOption,
								formData.gender === option &&
									styles.selectedGender,
							]}
							onPress={() => handleInputChange("gender", option)}
						>
							<Text
								style={[
									styles.genderText,
									formData.gender === option &&
										styles.selectedGenderText,
								]}
							>
								{option.charAt(0).toUpperCase() +
									option.slice(1)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
			<TextInput
				style={styles.input}
				placeholder="Address"
				value={formData.address}
				onChangeText={(value) => handleInputChange("address", value)}
			/>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Year</Text>
				<View style={styles.dropdownContainer}>
					<Picker
						selectedValue={formData.year}
						onValueChange={(value) =>
							handleInputChange("year", value)
						}
					>
						<Picker.Item label="Select Year" value="" />
						<Picker.Item label="1st" value="1st" />
						<Picker.Item label="2nd" value="2ns" />
						<Picker.Item label="3rd" value="3rd" />
						<Picker.Item label="4th" value="4th" />
					</Picker>
				</View>
			</View>

			<TextInput
				style={styles.input}
				placeholder="College"
				value={formData.college}
				onChangeText={(value) => handleInputChange("college", value)}
			/>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Hostel</Text>
				<View style={styles.dropdownContainer}>
					<Picker
						selectedValue={formData.hostel}
						onValueChange={(value) =>
							handleInputChange("hostel", value)
						}
					>
						<Picker.Item label="Select Hostel" value="" />
						<Picker.Item label="Aryabhatt" value="Aryabhatt" />
						<Picker.Item label="RN Tagore" value="RN Tagore" />
						<Picker.Item
							label="Sarojni Naidu"
							value="Sarojni Naidu"
						/>
					</Picker>
				</View>
			</View>
			<TextInput
				style={styles.input}
				placeholder="Room Number"
				value={formData.room_no}
				onChangeText={(value) => handleInputChange("room_no", value)}
				keyboardType="numeric"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={formData.password}
				onChangeText={(value) => handleInputChange("password", value)}
				secureTextEntry
			/>
			<TextInput
				style={styles.input}
				placeholder="Confirm Password"
				value={formData.confirm_password}
				onChangeText={(value) =>
					handleInputChange("confirm_password", value)
				}
				secureTextEntry
			/>
			<View style={styles.buttonContainer}>
				<Button
					title="Add Hostler"
					onPress={handleSubmit}
					color="#2cb5a0"
				/>
			</View>
			<ErrorAlert
				message={alertMessage}
				alert={alert}
				setAlert={setAlert}
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
	inputContainer: {
		marginBottom: 15,
	},
	genderContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	genderOption: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#ddd",
		margin: 5,
		flex: 1,
		alignItems: "center",
	},
	selectedGender: {
		backgroundColor: "#2cb5a0",
	},
	genderText: {
		fontSize: 16,
		color: "#555",
	},
	selectedGenderText: {
		color: "#fff",
		fontWeight: "bold",
	},
	dropdownContainer: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		backgroundColor: "#fff",
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
	pickerContainer: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		backgroundColor: "#fff",
		marginVertical: 10,
		padding: 10,
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

export default AddHostler;
