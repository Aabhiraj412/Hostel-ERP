import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

interface AttendanceCardProps {
	data: {
		_id: string;
		name: string;
		room_no: string;
		present_on: string[]; // Assuming array of ISO date strings
	};

	present: string[];
	
    toggleSelection: (id: string) => void; // Function to update selected hostelrs
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
	data,
	toggleSelection,
	present,
}) => {
	const [isSelected, setIsSelected] = useState(false);

	const check = () => {
		if (present.length > 0 && present.includes(data._id)) {
			setIsSelected(true);
		}
        const date = new Date();
        const today = date.toLocaleDateString("en-CA", {
			timeZone: "Asia/Kolkata",
		});
        if(data.present_on.length > 0 ){
            data.present_on.forEach((date) => {
                if(date.split("T")[0] === today.split("T")[0]){
                    setIsSelected(true);
                }
            });
            // setIsSelected(true);
        }
	};

	useEffect(() => {
		check();
	}, []);

	const handlePress = () => {
		setIsSelected(!isSelected);
		toggleSelection(data._id); // Notify MarkAttendance.tsx about selection change
	};

	return (
		<Pressable
			onPress={handlePress}
			style={[
				styles.card,
				{ backgroundColor: isSelected ? "#2cb5a0" : "#ffffff" },
			]}
		>
			<Text
				style={[
					styles.label,
					{ color: isSelected ? "#ffffff" : "#2cb5a0" },
				]}
			>
				{data.name}
			</Text>
			<Text
				style={[
					styles.label,
					{ color: isSelected ? "#ffffff" : "#2cb5a0" },
				]}
			>
				{data.room_no}
			</Text>
		</Pressable>
	);
};

export default AttendanceCard;

const styles = StyleSheet.create({
	card: {
		padding: 15,
		borderRadius: 10,
		marginVertical: 10,
		// marginHorizontal: 10,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 3,
		borderLeftWidth: 5,
		borderLeftColor: "#2cb5a0",
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: "600",
	},
});
