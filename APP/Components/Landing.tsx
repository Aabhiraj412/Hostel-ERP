import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "./Components/Cards";
import useStore from "../Store/Store";

const Landing: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { user, cookie } = useStore();
	const navigateToWarden = () => {
		if (cookie && user === "Warden") 
      navigation.navigate("Warden");
		else 
      navigation.navigate("Warden Login");
	};

	const navigateToHostler = () => {
    if (cookie && user === "Hostler")
      navigation.navigate("Hostler");
    else
  		navigation.navigate('Hostler Login');
	};

	return (
		<View style={styles.container}>
			<Card title="Warden" onPress={navigateToWarden} />
			<Card title="Hostler" onPress={navigateToHostler} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});

export default Landing;
