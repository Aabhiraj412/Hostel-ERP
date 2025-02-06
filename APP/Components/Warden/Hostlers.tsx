import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import HostlersCard from "../Components/HostlersCards";
import { ScrollView } from "react-native-gesture-handler";
import Dropdown from "../Components/Dropdown";

const Hostlers = () => {
	const { localhost, cookie } = useStore();
	const [hostel, setHostel] = useState(null); // Selected hostel
	const [hostlers, setHostlers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState(""); // Search query state

	const fetchHostlers = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`${localhost}/api/warden/gethostlers`,
				{
					headers: {
						Cookie: cookie,
					},
				}
			);
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					errorResponse.message || "Login failed. Please try again."
				);
			}
			const data = await response.json();
			setHostlers(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHostlers();
	}, []);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}
	if (error)
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Error: {error}</Text>
			</View>
		);

	// Dropdown options for hostel selection, including "All Hostels"
	const hostelOptions = [
		{ label: "All Hostels", value: null }, // Option to display all hostels
		...Array.from(new Set(hostlers.map((hostler) => hostler.hostel))).map(
			(hostel) => ({
				label: hostel,
				value: hostel,
			})
		),
	];

	// Filter hostlers by selected hostel
	const filteredHostlers = hostlers.filter(
		(hostler) => !hostel || hostler.hostel === hostel
	);

	// Filter hostlers by search query (name or room number)
	const searchedHostlers = filteredHostlers.filter((hostler) => {
		const roomNumberMatch = hostler.room_no
			.toString()
			.includes(searchQuery); // Convert room number to string
		const nameMatch = hostler.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());

		return nameMatch || roomNumberMatch;
	});

	return (
		<View style={styles.container}>
			<Dropdown
				value={hostel}
				setValue={setHostel}
				items={hostelOptions}
				placeholder="Select Hostel"
			/>
			<TextInput
				style={styles.searchInput}
				placeholder="Search by name or room number"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>
			<ScrollView style={styles.scrollView}>
				{searchedHostlers.length > 0 ? (
					searchedHostlers.map((hostler) => (
						<HostlersCard key={hostler._id} data={hostler} />
					))
				) : (
					<Text style={styles.emptyText}>
						No hostlers found for the selected hostel or search
						criteria.
					</Text>
				)}
			</ScrollView>
		</View>
	);
};

export default Hostlers;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "red",
		fontSize: 16,
	},
	scrollView: {
		marginTop: 16,
	},
	searchInput: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		marginVertical: 10,
		paddingLeft: 10,
		borderRadius: 5,
	},
	emptyText: {
		textAlign: "center",
		marginTop: 16,
		color: "#777",
		fontSize: 16,
	},
});
