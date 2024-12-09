import React, { useEffect } from "react";
import { StyleSheet, Text, View, Animated, Easing, Image } from "react-native";
import useStore from "../../Store/Store";

const SplashScreen = ({ navigation }) => {
  const { cookie, user } = useStore();
  const fadeAnim = new Animated.Value(0); // Initial opacity value

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => console.log("Animation completed"));

    // Navigate to the next screen
    const timer = setTimeout(() => {
      const nextRouteName = cookie
        ? user === "Warden"
          ? "Warden Dashboard"
          : user === "Hostler"
          ? "Hostler Dashboard"
          : "Home"
        : "Home";
      navigation.replace(nextRouteName);
    }, 4000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [cookie, user, navigation]);

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        source={require("../../Assets/logo.png")} // Replace with your logo path
        style={styles.logo}
      />

      {/* App Name */}
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        Hostel ERP
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Manage Your Hostel Effortlessly
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2cb5a0",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#fff",
    fontStyle: "italic",
  },
});
