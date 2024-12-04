import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import React from "react";
import { Alert } from 'react-native';
import MiniCard from "../Components/MiniCard";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../Store/Store";

const WardenDash = () => {
  const navigation = useNavigation<any>();
  const { localhost, cookie } = useStore();

  // Navigation handlers
  const navigateTo = (route) => () => {
    navigation.navigate(route);
  };


  const changeIP = async () => {
	try {
	  // Show a confirmation dialog
	  Alert.alert(
		"Confirm IP Change",
		"Are you sure you want to change the Attendance IP?",
		[
		  {
			text: "Cancel",
			onPress: () => console.log("IP change cancelled"),
			style: "cancel",
		  },
		  {
			text: "Confirm",
			onPress: async () => {
			  try {
				const response = await fetch(`http://${localhost}:3000/api/warden/changeip`, {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				  },
				  body: JSON.stringify({
					localhost: localhost, // Send the localhost IP to the backend
				  }),
				});
  
				if (!response.ok) {
				  throw new Error("Failed to update IP");
				}
  
				const result = await response.json();
				console.log(result.message); // Log success message
  
				// Show a success alert after updating IP
				Alert.alert(
				  "Success",
				  "The Attendance IP has been updated successfully.",
				  [{ text: "OK", onPress: () => console.log("IP update confirmed") }]
				);
			  } catch (error) {
				console.error("Error updating IP:", error.message);
  
				// Show an error alert if the update fails
				Alert.alert(
				  "Update Failed",
				  "Failed to update the Attendance IP.",
				  [{ text: "OK", onPress: () => console.log("Error confirmed") }]
				);
			  }
			},
		  },
		]
	  );
	} catch (error) {
	  console.error("Error handling confirmation:", error.message);
	}
  };
  
	
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Row 1: Hostler Management */}
          <View style={styles.row}>
            <MiniCard
              title="Add Hostler"
              onPress={navigateTo("Add Hostler")}
              IconComponent={({ size, color }) => (
                <Ionicons name="person-add-outline" size={size} color={color} />
              )}
            />
            <MiniCard
              title="View Hostlers"
              onPress={navigateTo("Hostlers")}
              IconComponent={({ size, color }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              )}
            />
          </View>

          {/* Row 2: Profile */}
          <View style={styles.row}>
            <MiniCard
              title="Profile"
              onPress={navigateTo("Warden")}
              IconComponent={({ size, color }) => (
                <Ionicons name="person-circle-outline" size={size} color={color} />
              )}
            />
            <MiniCard
              title="Attendance"
              onPress={navigateTo("Hostlers Attendance")}
              IconComponent={({ size, color }) => (
                <Ionicons name="clipboard-outline" size={size} color={color} />
              )}
            />
          </View>

          {/* Row 3: Leaves */}
          <View style={styles.row}>
            <MiniCard
              title="Leaves"
              onPress={navigateTo("Leaves")}
              IconComponent={({ size, color }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              )}
            />
            <MiniCard
              title="Publish Notice"
              onPress={navigateTo("Publish Notice")}
              IconComponent={({ size, color }) => (
                <Ionicons name="megaphone-outline" size={size} color={color} />
              )}
            />
          </View>

          {/* Row 4: Grievances */}
          <View style={styles.row}>
            <MiniCard
              title="Public Grievances"
              onPress={navigateTo("Public Grievances")}
              IconComponent={({ size, color }) => (
                <Ionicons name="help-circle-outline" size={size} color={color} />
              )}
            />
            <MiniCard
              title="Private Grievances"
              onPress={navigateTo("Private Grievances")}
              IconComponent={({ size, color }) => (
                <Ionicons name="lock-closed-outline" size={size} color={color} />
              )}
            />
          </View>

          {/* Row 5: Notices & Mess Menu */}
          <View style={styles.row}>
            <MiniCard
              title="View Notices"
              onPress={navigateTo("Notices")}
              IconComponent={({ size, color }) => (
                <Ionicons name="document-text-outline" size={size} color={color} />
              )}
            />
            <MiniCard
              title="Mess Menu"
              onPress={navigateTo("Mess Menu")}
              IconComponent={({ size, color }) => (
                <Ionicons name="restaurant-outline" size={size} color={color} />
              )}
            />
          </View>

          {/* Row 6: Outdoor Register & Change IP */}
          <View style={styles.row}>
            <MiniCard
              title="Outdoor Register"
              onPress={navigateTo("Out Register")}
              IconComponent={({ size, color }) => (
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={size}
                  color={color}
                />
              )}
            />
            <MiniCard
              title="Change Attendance IP"
              onPress={changeIP}
              IconComponent={({ size, color }) => (
                <MaterialCommunityIcons
                  name="wifi-settings"
                  size={size}
                  color={color}
                />
              )}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

export default WardenDash;
