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

const Notices = () => {
	const { localhost, cookie } = useStore();
	const [data, setData] = useState([]); // Initialize data as an empty array
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#2cb5a0" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	if (!data.length) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.noDataText}>No notices found.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView>
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
		flexGrow: 1,
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
