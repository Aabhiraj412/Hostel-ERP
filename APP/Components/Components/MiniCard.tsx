import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MiniCardProps {
  title: string;
  onPress: () => void;
  IconComponent: React.FC<{ size: number; color: string }>; // Icon as a prop
}

const MiniCard: React.FC<MiniCardProps> = ({ title, onPress, IconComponent }) => {
  return (
    <TouchableOpacity style={styles.cardClient} onPress={onPress}>
      <View style={styles.userPicture}>
        {/* Render the passed icon */}
        <IconComponent size={40} color="#2cb5a0" />
      </View>
      <Text style={styles.nameClient}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardClient: {
    backgroundColor: "#2cb5a0",
    width: 150,
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
    margin: 20,
  },
  userPicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#7cdacc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  nameClient: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});

export default MiniCard;
