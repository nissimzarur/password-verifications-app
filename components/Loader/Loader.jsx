import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import LoaderAnim from "./Loader.json";

const Loader = ({isLoading=false}) => {
  return (
    <AnimatedLoader
      visible={isLoading}
      overlayColor="rgba(255,255,255,0.75)"
      source={LoaderAnim}
      animationStyle={styles.lottie}
      speed={1}
    >
      <Text>Please wait while we check your password...</Text>
    </AnimatedLoader>
  );
};

export default Loader;

const styles = StyleSheet.create({
	lottie: {
	  width: 100,
	  height: 100
	}
  });