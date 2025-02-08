import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For dropdown
import useStore from "../../Store/Store";
import SuccessAlert from "../Components/SuccessAlert";
import ErrorAlert from "../Components/ErrorAlert";
import AttendanceCard from "../Components/AttendanceCard";
import { useNavigation } from "@react-navigation/native";

const ViewAttendance = () => {
	const { localhost, cookie } = useStore();
	const [selectedHostel, setSelectedHostel] = useState("All");
	const [hostlers, setHostlers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [present, setPresent] = useState<string[]>([]);
	const [changes, setChanges] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const navigation = useNavigation<any>();
	const itemsPerPage = 2;

	useEffect(() => {
		if (selectedHostel) {
			fetchHostlers();
		}
	}, [selectedHostel]);

	useEffect(() => {
		// Reset to first page when new hostlers are fetched
		setCurrentPage(1);
	}, [hostlers]);

	const fetchHostlers = async () => {
		setLoading(true);

		try {
			const response = await fetch(
				`${localhost}/api/warden/getHostlers`, // Make sure this endpoint is correct
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Unable to fetch Hostlers");
			}

			const filteredByHostel = filterHostlersByHostel(data);

			setHostlers(filteredByHostel);

			const presentreq = await fetch(
				`${localhost}/api/warden/saveattendance`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify({
						students: present,
					}),
				}
			);

			const presentData = await presentreq.json();

			if (!presentreq.ok) {
				throw new Error(
					presentData.message || "Unable to save attendance"
				);
			}

			setPresent(presentData.hostler);
		} catch (error) {
			setAlertMessage(error.message || "Unable to fetch Hostlers");
			setAlert(true);
		} finally {
			setLoading(false);
		}
	};

	const filterHostlersByHostel = (hostlers) => {
		if (selectedHostel === "All") {
			return hostlers;
		}
		return hostlers.filter((hostler) => hostler.hostel === selectedHostel);
	};

	const toggleSelection = (id: string) => {
		setChanges(true);
		present.includes(id)
			? setPresent(present.filter((hostlerId) => hostlerId !== id))
			: setPresent([...present, id]);
	};

	// Pagination: Slice the data based on currentPage and itemsPerPage
	const indexOfLastHostler = currentPage * itemsPerPage;
	const indexOfFirstHostler = indexOfLastHostler - itemsPerPage;
	const currentHostlers = hostlers.slice(
		indexOfFirstHostler,
		indexOfLastHostler
	);

	const totalPages = Math.ceil(hostlers.length / itemsPerPage);

	const nextPage = async () => {
		setLoading(true);

		try {
			if (changes) {
				const presentreq = await fetch(
					`${localhost}/api/warden/saveattendance`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Cookie: cookie,
						},
						body: JSON.stringify({
							students: present,
						}),
					}
				);

				const presentData = await presentreq.json();

				if (!presentreq.ok) {
					throw new Error(
						presentData.message || "Unable to save attendance"
					);
				}

				setPresent(presentData.hostler);
			}
		} catch (error) {
			setAlertMessage(error.message || "Unable to save attendance");
			setAlert(true);
		} finally {
			setLoading(false);
		}

		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
			setChanges(false);
		}
	};

	const prevPage = async () => {
		setLoading(true);

		try {
			if (changes) {
				const presentreq = await fetch(
					`${localhost}/api/warden/saveattendance`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Cookie: cookie,
						},
						body: JSON.stringify({
							students: present,
						}),
					}
				);

				const presentData = await presentreq.json();

				if (!presentreq.ok) {
					throw new Error(
						presentData.message || "Unable to save attendance"
					);
				}

				setPresent(presentData.hostler);
			}
		} catch (error) {
			setAlertMessage(error.message || "Unable to save attendance");
			setAlert(true);
		} finally {
			setLoading(false);
		}

		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			setChanges(false);
		}
	};

	const markAttendence = async () => {
		setLoading(true);

		try {
			const presentreq = await fetch(
				`${localhost}/api/warden/saveattendance`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify({
						students: present,
					}),
				}
			);

			const presentData = await presentreq.json();

			if (!presentreq.ok) {
				throw new Error(
					presentData.message || "Unable to save attendance"
				);
			}

			const mark = await fetch(`${localhost}/api/warden/markattendance`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
			});

			const markData = await mark.json();

			if (!mark.ok) {
				throw new Error(
					markData.message || "Unable to save attendance"
				);
			}

			setSuccessMessage("Attendance marked successfully");
			setSuccess(true);
			navigation.replace("Warden Dashboard");
		} catch (error) {
			setAlertMessage(error.message || "Unable to save attendance");
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
		<View style={styles.container}>
			{/* Hostel Dropdown */}
			<View style={styles.inputContainer}>
				<View style={styles.dropdownContainer}>
					<Picker
						selectedValue={selectedHostel}
						onValueChange={(value) => setSelectedHostel(value)}
					>
						<Picker.Item label="All Hostels" value="All" />
						<Picker.Item label="Aryabhatt" value="Aryabhatt" />
						<Picker.Item label="RN Tagore" value="RN Tagore" />
						<Picker.Item
							label="Sarojni Naidu"
							value="Sarojni Naidu"
						/>
					</Picker>
				</View>
			</View>

			{/* Display Hostlers */}
			<ScrollView>
				{currentHostlers.map((hostler) => (
					<AttendanceCard
						key={hostler._id}
						data={hostler}
						present={present}
						toggleSelection={toggleSelection}
					/>
				))}
			</ScrollView>

			{/* Pagination Controls */}
			<View style={styles.pagination}>
				{currentPage === 1 ? (
					<View
						style={styles.disabledButton}
						// onPress={prevPage}
					>
						<Text style={styles.disabledButtonText}>Previous</Text>
					</View>
				) : (
					<TouchableOpacity
						style={styles.fetchButton}
						onPress={prevPage}
					>
						<Text style={styles.fetchButtonText}>Previous</Text>
					</TouchableOpacity>
				)}
				<Text style={styles.pageNumber}>
					Page {currentPage} of {totalPages}
				</Text>
				{currentPage === totalPages ? (
					<View
						style={styles.disabledButton}
						// onPress={nextPage}
					>
						<Text style={styles.disabledButtonText}>
							Save & Next
						</Text>
					</View>
				) : (
					<TouchableOpacity
						style={styles.fetchButton}
						onPress={nextPage}
					>
						<Text style={styles.fetchButtonText}>Save & Next</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Mark Attendance Button */}
			<TouchableOpacity
				style={styles.fetchButton}
				onPress={markAttendence}
			>
				<Text style={styles.fetchButtonText}>Mark Attendance</Text>
			</TouchableOpacity>

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

export default ViewAttendance;

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "#121212", // Dark background while loading
	},
	container: {
		flex: 1,
		padding: 20,
		// backgroundColor: "#1f1f1f", // Dark background color
	},
	dropdownContainer: {
		borderWidth: 1,
		borderColor: "#444", // Slightly darker border for dropdown
		borderRadius: 12,
		backgroundColor: "#fff",
		overflow: "hidden", // Round corners
	},
	inputContainer: {
		marginBottom: 20,
	},
	fetchButton: {
		paddingVertical: 12,
		paddingHorizontal: 25,
		backgroundColor: "#2cb5a0", // Main button color
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 5,
	},
	fetchButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	disabledButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#A0A0A0", // Light gray to indicate disabled state
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
    opacity: 0.6, // Reduced opacity for a disabled effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
},
disabledButtonText: {
    color: "#fff", // Slightly lighter gray for better readability
    fontWeight: "bold",
    fontSize: 16,
},
pagination: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 15,
	},
	pageNumber: {
		fontSize: 16,
		// color: "#fff", // White text for the page number
		fontWeight: "500",
		marginHorizontal: 20,
	},
});
