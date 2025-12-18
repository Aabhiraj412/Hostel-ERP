import React from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";

interface SuccessAlertProps {
	message: string;
	success: boolean;
	setSuccess: (value: boolean) => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
	message,
	success,
	setSuccess,
}) => {
	return (
		<Modal animationType="slide" transparent={true} visible={success}>
			<TouchableWithoutFeedback onPress={() => setSuccess(false)}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>{"Success"}</Text>
						<Text style={styles.modalText}>{message}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#2cb5a0",
	},
	modalText: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
});

export default SuccessAlert;
