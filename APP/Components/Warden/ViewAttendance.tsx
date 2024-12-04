import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // For dropdown
import useStore from "../../Store/Store";

const ViewAttendance = () => {
	const { localhost, cookie } = useStore();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedHostel, setSelectedHostel] = useState("All");
	const [hostlers, setHostlers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (selectedHostel) {
			fetchHostlers();
		}
	}, [selectedHostel, selectedDate]);

	const fetchHostlers = async () => {
		if (!selectedHostel) {
			Alert.alert("Error", "Please select a hostel.");
			return;
		}

		setLoading(true);
		try {
			const adjustedDate = new Date(selectedDate);
			adjustedDate.setHours(18, 30, 0, 0); // Set time to midnight

			const formattedDate = adjustedDate.toISOString().split("T")[0]; // Convert to "yyyy-mm-dd" format (date only)
			console.log(formattedDate);
			const response = await fetch(
				`http://${localhost}:3000/api/warden/getHostlers`, // Make sure this endpoint is correct
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch hostlers. Status: ${response.status}`
				);
			}

			const data = await response.json();
			const filteredByDate = filterHostlersByDate(data, formattedDate);
			const filteredByHostel = filterHostlersByHostel(filteredByDate);

			setHostlers(filteredByHostel);
		} catch (error) {
			console.error("Error fetching hostlers:", error);
			Alert.alert("Error", "Failed to fetch hostlers.");
		} finally {
			setLoading(false);
		}
	};

	const filterHostlersByDate = (data, selectedDate) => {
		const date = `${selectedDate}`; // Time part added to match the date format from the server
		return data.map((hostler) => {
			const isPresent = hostler.present_on.some(
				(attendanceDate) => attendanceDate.split("T")[0] === date
			);
			return {
				...hostler,
				status: isPresent ? "present" : "absent",
			};
		});
	};

	const filterHostlersByHostel = (hostlers) => {
		if (selectedHostel === "All") {
			return hostlers;
		}
		return hostlers.filter((hostler) => hostler.hostel === selectedHostel);
	};

	const onChangeDate = (event, selectedDate) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setSelectedDate(selectedDate);
		}
	};

	const renderHostlerItem = ({ item }) => {
		return (
			<View style={styles.hostlerItem}>
				<Text style={styles.hostlerName}>{item.name}</Text>
				<Text style={styles.roomNo}>Room No: {item.room_no}</Text>
				<Text
					style={[
						styles.status,
						item.status === "absent" && styles.absentStatusText, // Only change text color when absent
					]}
				>
					{item.status === "present" ? "Present" : "Absent"}
				</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>View Attendance</Text>

			{/* Date Picker */}
			<TouchableOpacity
				style={styles.datePickerButton}
				onPress={() => setShowDatePicker(true)}
			>
				<Text style={styles.datePickerText}>
					{selectedDate.toDateString()}
				</Text>
			</TouchableOpacity>
			{showDatePicker && (
				<DateTimePicker
					value={selectedDate}
					mode="date"
					display="default"
					onChange={onChangeDate}
				/>
			)}

			{/* Hostel Dropdown */}
			<View style={styles.inputContainer}>
				<View style={styles.dropdownContainer}>
					<Picker
						selectedValue={selectedHostel}
						onValueChange={(value) => setSelectedHostel(value)}
					>
						<Picker.Item label="Select Hostel" value="All" />
						<Picker.Item label="Aryabhatt" value="Aryabhatt" />
						<Picker.Item label="RN Tagore" value="RN Tagore" />
						<Picker.Item
							label="Sarojni Naidu"
							value="Sarojni Naidu"
						/>
					</Picker>
				</View>
			</View>

			{/* Fetch Button */}
			<TouchableOpacity
				style={styles.fetchButton}
				onPress={fetchHostlers}
				disabled={loading}
			>
				<Text style={styles.fetchButtonText}>
					{loading ? "Fetching..." : "Fetch Attendance"}
				</Text>
			</TouchableOpacity>

			{/* Display Hostlers */}
			<FlatList
				data={hostlers}
				keyExtractor={(item) => item._id}
				renderItem={renderHostlerItem}
			/>
		</View>
	);
};

export default ViewAttendance;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2cb5a0",
		marginBottom: 16,
		textAlign: "center",
	},
	datePickerButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#f7a400",
		borderRadius: 8,
		marginBottom: 16,
		alignItems: "center",
	},
	datePickerText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	dropdownContainer: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		backgroundColor: "#fff",
	},
	inputContainer: {
		marginBottom: 15,
	},
	fetchButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#2cb5a0",
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 16,
	},
	fetchButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	hostlerItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},
	hostlerName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	roomNo: {
		fontSize: 14,
		color: "#555",
	},
	status: {
		fontSize: 14,
		color: "#2cb5a0", // Default color for "Present"
	},
	absentStatusText: {
		color: "red", // Change text color to red when absent
	},
});
