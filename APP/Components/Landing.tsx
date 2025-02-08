import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import useStore from "../Store/Store";
import Card from "./Components/Cards";

const Landing: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { user, cookie } = useStore();

	const navigateToWarden = () => {
		if (cookie && user === "Warden") {
			navigation.reset({
				index: 0,
				routes: [{ name: "Warden Dashboard" }],
			});
		} else {
			navigation.navigate("Warden Login");
		}
	};

	const navigateToHostler = () => {
		if (cookie && user === "Hosteller") {
			navigation.reset({
				index: 0,
				routes: [{ name: "Home Dashboard" }],
			});
		} else {
			navigation.navigate("Hosteller Login");
		}
	};

	return (
		<LinearGradient
			colors={["#ffffff", "#f0f8ff"]}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.welcomeText}>Welcome !!</Text>
				<Card
					title="Warden"
					onPress={navigateToWarden}
					IconComponent={({ size, color }) => (
						<FontAwesome
							name="user-secret"
							size={size}
							color={color}
						/>
					)}
				/>
				<Card
					title="Hosteller"
					onPress={navigateToHostler}
					IconComponent={({ size, color }) => (
						<MaterialCommunityIcons
							name="account-group"
							size={size}
							color={color}
						/>
					)}
				/>
			</ScrollView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollContent: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 50,
	},
	welcomeText: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#2cd5a0",
		marginBottom: 30,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 5,
	},
});

export default Landing;
