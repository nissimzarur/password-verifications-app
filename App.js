import React, { useState } from "react";
import * as encoding from "text-encoding";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from "react-native";
import Joi from "joi";
import { JoiPassword } from "joi-password";
import axios from "axios";

//Components
import Loader from "./components/Loader/Loader";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import SuccessModal from "./components/SuccessModal/SuccessModal";
import Divider from "./components/Divider/Divider";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Password Verifications App</Text>
      </View>
      <ScrollView>
        <PasswordMatchView />
      </ScrollView>
    </View>
  );
}

const PasswordMatchView = () => {
  const [showPasswordLengthError, setShowPasswordLengthError] = useState(true);
  const [showPasswordMatchError, setShowPasswordMatchError] = useState(true);
  const [showMinOfLowercaseError, setMinOfLowercaseError] = useState(true);
  const [showMinOfUppercaseError, setMinOfUppercaseError] = useState(true);
  const [showMinOfNumericError, setMinOfNumericError] = useState(true);
  const [passwords, setPasswords] = useState({ first: "", second: "" });
  const [passwordsIsValid, setPasswordsIsValid] = useState(false);

  const onPasswordChangeHandler = async (newText, field) => {
    //Check if valid.
    let minOfLowercaseError = "";
    let minOfUppercaseError = "";
    let minOfNumericError = "";
    let passwordMatchAndFullfield = "";

    if (field == "first") {
      setShowPasswordLengthError(parseInt(newText.length) >= 6 ? false : true);

      const minOfLowercaseSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfLowercase(1).required().messages({
            "password.minOfLowercase": "minOfLowercase",
          }),
        }).validate(input);

      minOfLowercaseError = minOfLowercaseSchema({
        password: newText,
      }).error;
      setMinOfLowercaseError(minOfLowercaseError);

      const minOfUppercaseSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfUppercase(1).required().messages({
            "password.minOfUppercase": "minOfUppercase",
          }),
        }).validate(input);

      minOfUppercaseError = minOfUppercaseSchema({
        password: newText,
      }).error;
      setMinOfUppercaseError(minOfUppercaseError);

      const minOfNumericSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfNumeric(1).required().messages({
            "password.minOfNumeric": "minOfNumeric",
          }),
        }).validate(input);

      minOfNumericError = minOfNumericSchema({ password: newText }).error;
      setMinOfNumericError(minOfNumericError);

      setShowPasswordMatchError(
        (passwordMatchAndFullfield =
          newText == passwords.second && newText != "" ? false : true)
      );
      setPasswords({ ...passwords, first: newText });
    } else if (field == "second") {
      setShowPasswordMatchError(
        (passwordMatchAndFullfield =
          newText == passwords.first && newText != "" ? false : true)
      );
      setPasswords({ ...passwords, second: newText });
    }

    setPasswordsIsValid(
      !minOfLowercaseError &&
        !minOfUppercaseError &&
        !minOfNumericError &&
        !passwordMatchAndFullfield
    );
  };

  return (
    <View>
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <TextInput
            placeholder="Enter password"
            style={styles.passwordInput}
            onChangeText={(newText) =>
              onPasswordChangeHandler(newText, "first")
            }
            maxLength={12}
            value={passwords.first}
          />
          <TextInput
            placeholder="Re-enter password"
            style={styles.passwordInput}
            onChangeText={(newText) =>
              onPasswordChangeHandler(newText, "second")
            }
            maxLength={12}
            value={passwords.second}
          />
        </View>
        <Divider />
      </KeyboardAvoidingView>
      <PasswordErrors
        showPasswordLengthError={showPasswordLengthError}
        showPasswordMatchError={showPasswordMatchError}
        showMinOfLowercaseError={showMinOfLowercaseError}
        showMinOfUppercaseError={showMinOfUppercaseError}
        showMinOfNumericError={showMinOfNumericError}
        passwordsIsValid={passwordsIsValid}
        passwords={passwords}
        setPasswords={setPasswords}
      />
    </View>
  );
};

const PasswordErrors = ({
  showPasswordLengthError,
  showPasswordMatchError,
  showMinOfLowercaseError,
  showMinOfUppercaseError,
  showMinOfNumericError,
  passwordsIsValid,
  passwords,
  setPasswords,
}) => {
  return (
    <View>
      <View style={styles.errors}>
        <Text
          style={[
            styles.errMsg,
            { borderColor: showPasswordMatchError ? "red" : "green" },
          ]}
        >
          Passwords match
        </Text>
        <Text
          style={[
            styles.errMsg,
            { borderColor: showPasswordLengthError ? "red" : "green" },
          ]}
        >
          Password must be at least 6 digits long
        </Text>
        <Text
          style={[
            styles.errMsg,
            { borderColor: showMinOfNumericError ? "red" : "green" },
          ]}
        >
          At least 1 number
        </Text>
        <Text
          style={[
            styles.errMsg,
            { borderColor: showMinOfLowercaseError ? "red" : "green" },
          ]}
        >
          At least 1 regular letter
        </Text>
        <Text
          style={[
            styles.errMsg,
            { borderColor: showMinOfUppercaseError ? "red" : "green" },
          ]}
        >
          At least 1 capital letter
        </Text>
      </View>
      <Divider />
      <SendButton
        passwordsIsValid={passwordsIsValid}
        passwords={passwords}
        setPasswords={setPasswords}
      />
    </View>
  );
};

const SendButton = ({ passwordsIsValid, passwords, setPasswords }) => {
  const [errMsg, setErrMsg] = useState(false);
  const [errModalVisible, setErrModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [succModalVisible, setSuccModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Only for testing, need to be outside of project.
  const API_URL = "http://192.168.1.211";
  const API_PORT = 4000;

  const onButtonClickHandler = () => {
    if (!passwordsIsValid) return;

    axios
      .post(`${API_URL}:${API_PORT}/users/saveUserPassword`, passwords)
      .then((resp) => {
        if (resp.data.success) {
          setUser(resp.data.user);
          setSuccModalVisible(true);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLoading(false);
          setErrMsg(err.message);
          setErrModalVisible(true);
        }, 1000);
      });
  };

  return (
    <View>
      <View
        style={{
          width: 200,
          flex: 1,
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        <Pressable
          style={[
            styles.sendButton,
            ({ pressed }) => {
              return {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              };
            },
          ]}
          onPress={onButtonClickHandler}
          // disabled={!passwordsIsValid} //i preffered to change the button text when it pressed.
        >
          {({ pressed }) => (
            <Text style={styles.sendButtonText}>
              {pressed
                ? passwordsIsValid
                  ? "Sending the passwords..."
                  : "Incorrect password"
                : "Send"}
            </Text>
          )}
        </Pressable>
      </View>
      <ErrorModal
        errModalVisible={errModalVisible}
        setErrModalVisible={setErrModalVisible}
        errMsg={errMsg}
      />
      <SuccessModal
        succModalVisible={succModalVisible}
        setSuccModalVisible={setSuccModalVisible}
        user={user}
        setPasswords={setPasswords}
      />
      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  form: {
    alignItems: "center",
  },
  errors: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errMsg: {
    borderColor: "red",
    borderRadius: 10,
    borderWidth: 0.5,
    margin: 5,
    padding: 5,
  },
  passwordInput: {
    width: 150,
    height: 50,
    marginTop: 20,
    borderWidth: 0.5,
    textAlign: "center",
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "black",
    borderRadius: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    padding: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonClick: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //   width:200
  },
});
