import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CardProps {
  title: string;
  onPress: () => void;
  IconComponent: React.FC<{ size: number; color: string }>; // Accept icon as a component prop
}

const Card: React.FC<CardProps> = ({ title, onPress, IconComponent }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        {/* Render the passed icon */}
        <IconComponent size={40} color="#2cb5a0" />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#2cb5a0",
    width: 200,
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
    marginVertical: 15,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#7cdacc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#fff", // White background for the icon
  },
  cardText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});

export default Card;
