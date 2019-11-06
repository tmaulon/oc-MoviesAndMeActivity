// Components/FilmSeenItem.js

import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { getImageFromApi } from "../API/TMDBApi";
import FadeIn from "../Animations/FadeIn";

class FilmSeenItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    };
  }

  _setToggled() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  render() {
    const { film, displayDetailForFilm } = this.props;

    const textHandler = this.state.toggle
      ? "Sorti le " +
        film.release_date
          .split("-")
          .reverse()
          .join("/")
      : film.title;

    return (
      <FadeIn>
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForFilm(film.id)}
          onLongPress={() => this._setToggled()}
          onPressOut={() => this._setToggled()}
        >
          <Image
            style={styles.image}
            source={{ uri: getImageFromApi(film.poster_path) }}
          />
          <Text style={styles.title_text}>{textHandler}</Text>
        </TouchableOpacity>
      </FadeIn>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    borderRadius: 120
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 5,
    marginLeft: 20
  }
});

export default FilmSeenItem;
