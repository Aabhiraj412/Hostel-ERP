import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../../Store/Store";
import { ActivityIndicator } from "react-native";
import NoticeCard from "../Components/NoticeCard";
import { ScrollView } from "react-native-gesture-handler";

const Notices = () => {
	const { localhost, cookie } = useStore();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const getNotices = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://${localhost}/api/warden/getnotices`,
				{
					headers: {
						Cookie: cookie,
					},
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data.message || "Unable to fetch Notices"
				);
			}
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
	},
});
