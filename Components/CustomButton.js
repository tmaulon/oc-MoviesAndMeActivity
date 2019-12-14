// Components/Search.js

import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

export default class CustomButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.handleOnPress}>
        <View style={styles.main_button}>
          <Text style={{ color: "#fff" }}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  main_button: {
    borderRadius: 50,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#0000ff",
    width: "auto"
  }
});
