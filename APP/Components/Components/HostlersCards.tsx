import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

// Type for the hosteller data
interface hostler {
  name: string;
  roll_no: string;
  aadhar: string;
  gender: string;
  fathers_name: string;
  mothers_name: string;
  phone_no: string;
  email: string;
  address: string;
  year: string;
  college: string;
  hostel: string;
  room_no: string;
  [key: string]: any;
}

// Update the navigation prop with correct types
interface hostlersCardProps {
  data: hostler;
}

const hostlersCard: React.FC<hostlersCardProps> = ({ data }) => {
  const navigation = useNavigation<any>();  // If using TypeScript, ensure that navigation is typed

  const onPress = () => {
    // Pass the data to the next screen on button press
    navigation.navigate("Hosteller Details", { hostler: data });
  };

  return (
    <TouchableOpacity style={styles.cardClient} onPress={onPress}>
      <Text style={styles.nameClient}>Name: {data.name}</Text>
      <Text style={styles.detailsText}>Room No: {data.room_no}</Text>
      <Text style={styles.detailsText}>Hostel: {data.hostel}</Text>
      <Text style={styles.detailsText}>College: {data.college}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardClient: {
    backgroundColor: "#2cb5a0",
    width: "88%",
    padding: 15, // Reduced padding for a more compact look
    borderWidth: 3, // Slightly smaller border width
    borderColor: "#7cdacc",
    borderRadius: 8, // Smaller border radius
    shadowColor: "#cfd4de",
    shadowOffset: { width: 0, height: 4 }, // Reduced shadow size
    shadowOpacity: 0.2, // Softer shadow
    shadowRadius: 6,
    elevation: 3, // Reduced elevation for less shadow depth
    alignItems: "flex-start", // Align to the left for a more compact layout
    justifyContent: "center",
    margin: 10, // Reduced margin for closer alignment
  },
  nameClient: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16, // Smaller font size
    textAlign: "left", // Align text to the left for a more compact look
    marginBottom: 5, // Reduced space between text elements
  },
  detailsText: {
    color: "#fff",
    fontWeight: "500", // Slightly lighter weight for non-name text
    fontSize: 14, // Smaller font size for details
    textAlign: "left", // Align text to the left for more compact style
    marginBottom: 5, // Space between each line of text
  },
});

export default hostlersCard;
