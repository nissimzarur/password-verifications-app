import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import * as encoding from "text-encoding";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Button,
} from "react-native";
import Joi from "joi";
import { JoiPassword } from "joi-password";

//Components
import Loader from "./components/Loader/Loader";
export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ first: "", second: "" });
  const [showPasswordLengthError, setShowPasswordLengthError] = useState(true);
  const [showPasswordMatchError, setShowPasswordMatchError] = useState(true);
  const [showMinOfLowercaseError, setMinOfLowercaseError] = useState(true);
  const [showMinOfUppercaseError, setMinOfUppercaseError] = useState(true);
  const [showMinOfNumericError, setMinOfNumericError] = useState(true);

  const onPasswordChangeHandler = async (newText, field) => {
    //Check if valid.
    let passwordsIsValid = true;
    if (field == "first") {
      setShowPasswordLengthError(parseInt(newText.length) >= 6 ? false : true);

      const minOfLowercaseSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfLowercase(1).required().messages({
            "password.minOfLowercase": "minOfLowercase",
          }),
        }).validate(input);

      const minOfLowercaseError = minOfLowercaseSchema({
        password: newText,
      }).error;
      setMinOfLowercaseError(minOfLowercaseError);

      const minOfUppercaseSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfUppercase(1).required().messages({
            "password.minOfUppercase": "minOfUppercase",
          }),
        }).validate(input);

      const minOfUppercaseError = minOfUppercaseSchema({
        password: newText,
      }).error;
      setMinOfUppercaseError(minOfUppercaseError);

      const minOfNumericSchema = (input) =>
        Joi.object({
          password: JoiPassword.string().minOfNumeric(1).required().messages({
            "password.minOfNumeric": "minOfNumeric",
          }),
        }).validate(input);

      const minOfNumericError = minOfNumericSchema({ password: newText }).error;
      setMinOfNumericError(minOfNumericError);

      setShowPasswordMatchError(
        newText == passwords.second && newText != "" ? false : true
      );
      setPasswords({ ...passwords, first: newText });
    } else if (field == "second") {
      setShowPasswordMatchError(
        newText == passwords.first && newText != "" ? false : true
      );
      setPasswords({ ...passwords, second: newText });
    }
  };

  const onButtonClickHandler = ()=>{
	  
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Password Verifications App</Text>
      </View>
      <ScrollView>
        <KeyboardAvoidingView>
          <View style={styles.form}>
            <TextInput
              placeholder="Enter password"
              style={styles.passwordInput}
              onChangeText={(newText) =>
                onPasswordChangeHandler(newText, "first")
              }
              maxLength={12}
            />
            <TextInput
              placeholder="Re-enter password"
              style={styles.passwordInput}
              onChangeText={(newText) =>
                onPasswordChangeHandler(newText, "second")
              }
              maxLength={12}
            />
          </View>
        </KeyboardAvoidingView>
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
        <Button
          onPress={() => {onButtonClickHandler}}
          title="Send"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        {isLoading && <Loader />}
      </ScrollView>
    </View>
  );
}

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
    margin: 20,
    borderWidth: 0.5,
    textAlign: "center",
    borderRadius: 10,
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
