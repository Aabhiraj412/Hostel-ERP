import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import { ActivityIndicator } from "react-native";
import NoticeCard from "../Components/NoticeCard";
import { ScrollView } from "react-native-gesture-handler";

const HNotices = () => {
	const { localhost, cookie } = useStore();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const getNotices = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}:3000/api/hostler/getnotices`,
				{
					headers: {
						Cookie: cookie,
					},
				}
			);
			if (!response.ok) {
				throw new Error(
					`Request failed with status code: ${response.status}`
				);
			}
			const data = await response.json();
			setData(data);
			// console.log(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

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

export default HNotices;

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
});
