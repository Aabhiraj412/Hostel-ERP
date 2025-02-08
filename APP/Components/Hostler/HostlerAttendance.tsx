import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import useStore from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const HostlerAttendance = () => {
	const { data, localhost, cookie, setData, setUser, setCookie } = useStore();
	const navigation = useNavigation<any>(); // Use navigation hook with any type
	const [loading, setLoading] = useState(false); // Loading state
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [logout, setLogout] = useState(false);
	const [loggingout, setLoggingout] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const hostlerData = data;

	const fetchHostlerData = async () => {
		try {
			setLoading(true); // Set loading to true while fetching data
			const response = await fetch(
				`${localhost}/api/hostler/getdetails`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || "Failed to fetch hosteller data."
				);
			}

			setData(result); // Update the store with fetched data
		} catch (error) {
			console.error("Error fetching hosteller data:", error);
			setAlertMessage(
				"Failed to fetch hosteller data. Please try again."
			);
		} finally {
			setLoading(false); // Set loading to false after the fetch is complete
		}
	};

	// useEffect(() => {
	// 	// Fetch hostler details when the component mounts
	// 	fetchHostlerData();
	// }, [localhost, setData]);

	const onRefresh = async () => {
		setRefreshing(true);
		fetchHostlerData();
		setRefreshing(false);
	};

	// If still loading, show the loading spinner
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}
	const presentDates = data.present_on.map((date) => date.split("T")[0]); // Extract YYYY-MM-DD format

	// Generate markedDates object
	const markedDates = {};
	presentDates.forEach((date) => {
		markedDates[date] = { selected: true, selectedColor: "#2CB5A0" }; // New primary color
	});

	// Generate absent dates in red
	const startDate = "2024-11-01"; // Set the starting date of attendance tracking
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const endDate = `${year}-${month + 1 > 9 ? month + 1 : `0${month + 1}`}-${
		day > 9 ? day-1 : `0${day-1}`
	}`; // Set the ending date

	const currentDate = new Date(startDate);
	while (currentDate <= new Date(endDate)) {
		const formattedDate = currentDate.toISOString().split("T")[0];
		if (!markedDates[formattedDate]) {
			markedDates[formattedDate] = {
				selected: true,
				selectedColor: "#E74C3C",
			}; // Red for absent days
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ flexGrow: 1 }}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<View style={styles.container}>
				<Calendar
					markedDates={markedDates}
					style={styles.calendar}
					theme={{
						backgroundColor: "#ffffff",
						calendarBackground: "#ffffff",
						textDisabledColor: "#757575",
						dotColor: "#2CB5A0",
						selectedDotColor: "#FFFFFF",
						arrowColor: "#2CB5A0",
						monthTextColor: "#2CB5A0",
						indicatorColor: "#2CB5A0",
						textDayFontSize: 16,
						textMonthFontSize: 18,
						textDayHeaderFontSize: 16,
					}}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	calendar: {
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#ffffff",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		width: "100%",
	},
});

export default HostlerAttendance;
