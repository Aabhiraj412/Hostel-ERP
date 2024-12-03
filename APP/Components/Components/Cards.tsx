import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

const Card: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => {

	return (
		<TouchableOpacity style={styles.cardClient} onPress={onPress}>
			<View style={styles.userPicture}>
				<Svg viewBox="0 0 448 512" width={40} height={40}>
					<Path
						d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
						fill="#fff"
					/>
				</Svg>
			</View>
			<Text style={styles.nameClient}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	cardClient: {
		backgroundColor: "#2cb5a0",
		width: 200,
		padding: 20,
		borderWidth: 4,
		borderColor: "#7cdacc",
		borderRadius: 10,
		shadowColor: "#cfd4de",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		margin: 20
	},
	userPicture: {
		width: 80,
		height: 80,
		borderRadius: 999,
		borderWidth: 4,
		borderColor: "#7cdacc",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	nameClient: {
		color: "#fff",
		fontFamily: "Poppins",
		fontWeight: "600",
		fontSize: 18,
		textAlign: "center",
		marginTop: 10,
	},
});

export default Card;
