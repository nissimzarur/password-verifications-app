import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

//Components
import Divider from "./../Divider/Divider";

export default function SuccessModal({
  succModalVisible,
  setSuccModalVisible,
  user,
  clearForm,
}) {
  let username = user.username ? user.username : "No user name";
  let userId = user.id ? user.id : "No user id";

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={succModalVisible}
        onRequestClose={() => {
          setSuccModalVisible(!succModalVisible);
          clearForm();
          // onPasswordChangeHandler("", "clear");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.textBold, styles.textCenter]}>
              Great! password attached to...
            </Text>
            <View>
              <Divider />
              <View>
                <Text style={[styles.textCenter, styles.textBold]}>
                  Usernmae
                </Text>
                <Text style={[styles.textCenter]}>{username}</Text>
              </View>
              <Divider />
              <View>
                <Text style={[styles.textCenter, styles.textBold]}>
                  User-Id
                </Text>
                <Text style={[styles.textCenter]}>{userId}</Text>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setSuccModalVisible(!succModalVisible);
                // onPasswordChangeHandler("", "clear");
                clearForm();
              }}
            >
              <Text
                style={[styles.buttonText, styles.textCenter, styles.textBold]}
              >
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    backgroundColor: "green",
    width: 70,
  },
  buttonText: {
    color: "white",
  },
  textCenter: {
    textAlign: "center",
  },
  textBold: {
    fontWeight: "bold",
  },
});
