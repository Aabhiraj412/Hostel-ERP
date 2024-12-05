import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ErrorAlertProps {
  message: string;
  alert: boolean;
  setAlert: (value: boolean) => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, alert, setAlert }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={alert}>
      <TouchableWithoutFeedback onPress={() => setAlert(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{"Error"}</Text>
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
    color: "#e74c3c",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ErrorAlert;
