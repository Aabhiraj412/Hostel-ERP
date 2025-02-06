import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";
import useStore from "../../Store/Store";

const HostlerAttendance = () => {
	const { data } = useStore();
	const presentDates = data.present_on.map(date => date.split("T")[0]); // Extract YYYY-MM-DD format

	// Generate markedDates object
	const markedDates = {};
	presentDates.forEach(date => {
		markedDates[date] = { selected: true, selectedColor: "#2CB5A0" }; // New primary color
	});

	// Generate absent dates in red
	const startDate = "2024-12-01"; // Set the starting date of attendance tracking
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const endDate = `${year}-${month + 1 > 9 ? month + 1 : `0${month + 1}`}-${day > 9 ? day : `0${day}`}`; // Set the ending date

	const currentDate = new Date(startDate);
	while (currentDate <= new Date(endDate)) {
		const formattedDate = currentDate.toISOString().split("T")[0];
		if (!markedDates[formattedDate]) {
			markedDates[formattedDate] = { selected: true, selectedColor: "#E74C3C" }; // Red for absent days
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return (
		<View style={styles.container}>
			<Calendar
				markedDates={markedDates}
				style={styles.calendar}
				theme={{
					backgroundColor: "#1E1E1E",
					calendarBackground: "#1E1E1E",
					dayTextColor: "#E0E0E0",
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
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212", // Dark background
		padding: 20,
		justifyContent: "center",
	},
	calendar: {
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#1E1E1E",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		width: "100%",
	},
});

export default HostlerAttendance;
