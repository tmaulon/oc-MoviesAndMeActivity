// Components/Seen.js

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FilmSeenList from "./FilmSeenList";
import { connect } from "react-redux";

class Seen extends React.Component {
  render() {
    return (
      <View style={styles.main_container}>
        <FilmSeenList
          films={this.props.seenFilm}
          navigation={this.props.navigation}
          seenList={true}
          favoriteList={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    seenFilm: state.toggleSeen.seenFilm
  };
};

export default connect(mapStateToProps)(Seen);
