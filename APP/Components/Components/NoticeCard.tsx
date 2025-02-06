import React from "react";
import {
	Text,
	StyleSheet,
	TouchableOpacity,
	View,
	Linking,
} from "react-native";
import useStore from "../../Store/Store";

// Type for the notice data
interface Notice {
	_id: string;
	title: string;
	description: string;
	createdAt: string; // Date string
}

// Props for NoticeCard
interface NoticeCardProps {
	data: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ data }) => {
	const { localhost } = useStore();

	const onPress = () => {
		const url = `${localhost}/api/warden/getnotice/${data._id}`;
		Linking.openURL(url).catch((err) =>
			console.error("Failed to open URL:", err)
		);
	};

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Title: {data.title}</Text>
			<Text style={styles.description}>
				Description: {data.description}
			</Text>
			<Text style={styles.date}>
				Published On: {new Date(data.createdAt).toLocaleDateString()}
			</Text>
			<TouchableOpacity style={styles.downloadButton} onPress={onPress}>
				<Text style={styles.downloadButtonText}>Download Notice</Text>
			</TouchableOpacity>
		</View>
	);
};

export default NoticeCard;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#2cb5a0",
		width: "100%",
		padding: 20,
		borderWidth: 4,
		borderColor: "#7cdacc",
		borderRadius: 10,
		shadowColor: "#cfd4de",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	title: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20,
		textAlign: "center",
		marginBottom: 10,
	},
	description: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
	},
	date: {
		color: "#e6f7f4",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 20,
	},
	downloadButton: {
		backgroundColor: "#145b59",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		elevation: 3,
	},
	downloadButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
		textAlign: "center",
	},
});
