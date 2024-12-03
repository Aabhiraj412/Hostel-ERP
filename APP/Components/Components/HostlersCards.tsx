import { useNavigation, ParamListBase } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

// Type for the hostler data
interface Hostler {
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
interface HostlersCardProps {
  data: Hostler;
}

const HostlersCard: React.FC<HostlersCardProps> = ({ data }) => {
  const navigation = useNavigation<any>();  // If using TypeScript, ensure that navigation is typed

  const onPress = () => {
    // Pass the data to the next screen on button press
    navigation.navigate("HostlerDetails", { hostler: data });
  };

  return (
    <TouchableOpacity style={styles.cardClient} onPress={onPress}>
      <Text style={styles.nameClient}>Name: {data.name}</Text>
      <Text style={styles.nameClient}>Roll No: {data.roll_no}</Text>
      <Text style={styles.nameClient}>Phone No: {data.phone_no}</Text>
      <Text style={styles.nameClient}>Email: {data.email}</Text>
      <Text style={styles.nameClient}>Room No: {data.room_no}</Text>
      <Text style={styles.nameClient}>Hostel: {data.hostel}</Text>
      <Text style={styles.nameClient}>College: {data.college}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardClient: {
    backgroundColor: "#2cb5a0",
    width: "88%",
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
  nameClient: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});

export default HostlersCard;
