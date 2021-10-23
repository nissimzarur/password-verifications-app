import React from "react";
import { StyleSheet, View } from "react-native";

export default function Divider() {
  return <View style={styles.underline} />;
}

const styles = StyleSheet.create({
  underline: {
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    margin: 10,
  },
});
