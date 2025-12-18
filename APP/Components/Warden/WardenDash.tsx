import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import React, { useState } from "react";
import MiniCard from "../Components/MiniCard";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";

const WardenDash = () => {
	const navigation = useNavigation<any>();
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	// Navigation handlers
	const navigateTo = (route) => () => {
		navigation.navigate(route);
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{/* Row 1: Hostler Management */}
					<View style={styles.row}>
						<MiniCard
							title="Add Hosteller"
							onPress={navigateTo("Add Hosteller")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="person-add"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="View Hostellers"
							onPress={navigateTo("Hostellers")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="people"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 2: Profile and Mark Attendance */}
					<View style={styles.row}>
						<MiniCard
							title="Profile"
							onPress={navigateTo("Warden")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="person-circle"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Mark Attendance"
							onPress={navigateTo("Mark Attendance")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="checkbox"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 3: Attendance & Leaves */}
					<View style={styles.row}>
						<MiniCard
							title="Attendance"
							onPress={navigateTo("Hostellers Attendance")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="clipboard"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Leaves"
							onPress={navigateTo("Leaves")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="calendar"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 4: Grievances Management */}
					<View style={styles.row}>
						<MiniCard
							title="Public Grievances"
							onPress={navigateTo("Public Grievances")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="help-circle"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Private Grievances"
							onPress={navigateTo("Private Grievances")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="lock-closed"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 5: Notices & Mess Menu */}
					<View style={styles.row}>
						<MiniCard
							title="View Notices"
							onPress={navigateTo("Notices")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="document-text"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Mess Menu"
							onPress={navigateTo("Mess Menu")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="restaurant"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>

					{/* Row 6: Outdoor Register & Publish Notice */}
					<View style={styles.row}>
						<MiniCard
							title="Outdoor Register"
							onPress={navigateTo("Out Register")}
							IconComponent={({ size, color }) => (
								<MaterialCommunityIcons
									name="clipboard-text"
									size={size}
									color={color}
								/>
							)}
						/>
						<MiniCard
							title="Publish Notice"
							onPress={navigateTo("Publish Notice")}
							IconComponent={({ size, color }) => (
								<Ionicons
									name="megaphone"
									size={size}
									color={color}
								/>
							)}
						/>
					</View>
				</ScrollView>
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
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 10,
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	buttonContainer: {
		marginTop: 30,
		flexDirection: "row",
		justifyContent: "space-between",
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
		marginBottom: 10,
		color: "#2cb5a0",
	},
	modalText: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
	modalButton: {
		flex: 1,
		backgroundColor: "#2cb5a0",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	scrollContent: {
		paddingVertical: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
});

export default WardenDash;
