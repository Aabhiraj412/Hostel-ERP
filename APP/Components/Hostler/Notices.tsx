import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Text,
	ScrollView,
} from "react-native";
import useStore from "../../Store/Store";
import NoticeCard from "../Components/NoticeCard";
import { RefreshControl } from "react-native-gesture-handler";

const Notices = () => {
	const { localhost, cookie } = useStore();
	const [data, setData] = useState([]); // Initialize data as an empty array
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	// Fetch notices function
	const getNotices = async () => {
		setLoading(true);
		setError(null); // Reset error before fetching
		try {
			const response = await fetch(
				`${localhost}/api/hostler/getnotices`,
				{
					headers: {
						Cookie: cookie,
					},
				}
			);
			const result = await response.json();

			// Handle unsuccessful responses
			if (!response.ok) {
				throw new Error(result.message || "Unable to fetch Notices");
			}

			// Set the notices data
			setData(result.notices || []);
		} catch (err: any) {
			console.error("Fetch Error:", err);
			setError(err.message || "Failed to load notices");
		} finally {
			setLoading(false);
		}
	};

	// Fetch notices when the component mounts
	useEffect(() => {
		getNotices();
	}, []);

	// Handle refresh
	const onRefresh = async () => {
		setRefreshing(true); // Start the refresh animation
		await getNotices(); // Fetch notices
		setRefreshing(false); // Stop the refresh animation
	};

	// Loading state
	if (loading && !refreshing) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	// Error state
	if (error) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	// No data state
	if (!data.length) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.noDataText}>No notices found.</Text>
			</View>
		);
	}

	// Notices found, render list
	return (
		<View style={styles.container}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{data.map((notice: any) => (
					<NoticeCard key={notice._id} data={notice} />
				))}
			</ScrollView>
		</View>
	);
};

export default Notices;

const styles = StyleSheet.create({
	container: {
		flex: 1, // Ensure container takes the full height available
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		color: "red",
		fontSize: 16,
		textAlign: "center",
	},
	noDataText: {
		color: "#666",
		fontSize: 16,
		textAlign: "center",
	},
});
