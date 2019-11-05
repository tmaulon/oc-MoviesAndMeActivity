// Components/Seen.js

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FilmList from "./FilmList";
import { connect } from "react-redux";

class Seen extends React.Component {
  render() {
    console.log("films vus => ", this.props);

    return (
      <View style={styles.main_container}>
        <FilmList
          films={this.props.seenFilm}
          navigation={this.props.navigation}
          seenList={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  avatar_container: {
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    seenFilm: state.toggleSeen.seenFilm
  };
};

export default connect(mapStateToProps)(Seen);
