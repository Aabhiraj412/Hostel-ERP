import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Importing the LinearGradient component
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"; // Example icon libraries
import useStore from "../Store/Store";
import Card from "./Components/Cards";

const Landing: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, cookie } = useStore();

  const navigateToWarden = () => {
    if (cookie && user === "Warden") 
		navigation.reset({
			index: 0, // Set the index to 0 to make the new screen the first screen in the stack
			routes: [{ name: 'Warden Dashboard' }], // Provide the name of the screen you want to navigate to
		  });
    else navigation.navigate("Warden Login");
  };

  const navigateToHostler = () => {
    if (cookie && user === "Hostler") 
		navigation.reset({
			index: 0, // Set the index to 0 to make the new screen the first screen in the stack
			routes: [{ name: 'Home Dashboard' }], // Provide the name of the screen you want to navigate to
		  });
    else navigation.navigate("Hostler Login");
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff"]} // Gradient colors
      style={styles.container}
    >
      <Text style={styles.welcomeText}>Welcome</Text> {/* Welcome Title */}
      <Card
        title="Warden"
        onPress={navigateToWarden}
        IconComponent={({ size, color }) => (
          <FontAwesome name="user-secret" size={size} color={color} />
        )}
      />
      <Card
        title="Hostler"
        onPress={navigateToHostler}
        IconComponent={({ size, color }) => (
          <MaterialCommunityIcons name="account-group" size={size} color={color} />
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
