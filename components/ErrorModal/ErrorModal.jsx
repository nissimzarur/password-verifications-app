import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

const ErrorModal = ({ errModalVisible, setErrModalVisible, errMsg }) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={errModalVisible}
        onRequestClose={() => {
          setErrModalVisible(!errModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitleText}>
              Sorry, something went wrong...
            </Text>
            <Text>{errMsg}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setErrModalVisible(!errModalVisible)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "red",
    width: 70,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitleText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});
