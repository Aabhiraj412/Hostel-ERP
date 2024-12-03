import { View, Alert, StyleSheet } from "react-native";
import React from "react";
import MiniCard from "../Components/MiniCard";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const WardenDash = () => {
    const navigation = useNavigation<any>(); // Use navigation hook with any type

	const addHostler = async () => {
		navigation.navigate('Add Hostler');
    };

    const viewHostlers = async () => {
        navigation.navigate('Hostlers');
    };

    const viewLeaves = async () => {
        navigation.navigate('Leaves');
    };
    
    const viewGrivances = async () => {
        navigation.navigate('Grivances');
    };

    const viewMessMenu = async () => {
        navigation.navigate('Mess Menu');
    };

    const viewNotices = async () => {
        navigation.navigate('Notices');
    };

    const viewAttendance = async () => {
        navigation.navigate('Hostlers Attendance');
    };

    const publishNotice = async () => {
        navigation.navigate('Publish Notice');
    };

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.row}>
					<MiniCard
						title="Add Hostler"
						onPress={addHostler}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="person-add-outline"
								size={size}
								color={color}
							/>
						)}
					/>
					<MiniCard
						title="Hostlers"
						onPress={viewHostlers}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="people-outline"
								size={size}
								color={color}
							/>
						)}
					/>
				</View>

				<View style={styles.row}>
					<MiniCard
						title="View Attendance"
						onPress={viewAttendance}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="clipboard-outline"
								size={size}
								color={color}
							/>
						)}
					/>
					<MiniCard
						title="Publish Notice"
						onPress={publishNotice}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="megaphone-outline"
								size={size}
								color={color}
							/>
						)}
					/>
				</View>

				<View style={styles.row}>
					<MiniCard
						title="Leaves"
						onPress={viewLeaves}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="calendar-outline"
								size={size}
								color={color}
							/>
						)}
					/>
					<MiniCard
						title="Grievances"
						onPress={viewGrivances}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="help-circle-outline"
								size={size}
								color={color}
							/>
						)}
					/>
				</View>

				<View style={styles.row}>
					<MiniCard
						title="Out Register"
						onPress={viewMessMenu}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="restaurant-outline"
								size={size}
								color={color}
							/>
						)}
					/>
					<MiniCard
						title="Change Attendance IP"
						onPress={viewNotices}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="document-text-outline"
								size={size}
								color={color}
							/>
						)}
					/>
				</View>
				<View style={styles.row}>
					<MiniCard
						title="Mess Menu"
						onPress={viewMessMenu}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="restaurant-outline"
								size={size}
								color={color}
							/>
						)}
					/>
					<MiniCard
						title="Notices"
						onPress={viewNotices}
						IconComponent={({ size, color }) => (
							<Ionicons
								name="document-text-outline"
								size={size}
								color={color}
							/>
						)}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 10,
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
