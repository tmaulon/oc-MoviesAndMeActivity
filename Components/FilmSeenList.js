// Components/FilmSeenList.js

import React from "react";
import { StyleSheet, FlatList } from "react-native";
import FilmSeenItem from "./FilmSeenItem";
import { connect } from "react-redux";

class FilmSeenList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: []
    };
  }

  _displayDetailForFilm = idFilm => {
    console.log("Display film " + idFilm);
    this.props.navigation.navigate("FilmDetail", { idFilm: idFilm });
  };

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.films}
        extraData={(this.props.favoritesFilm, this.props.seenFilm)}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <FilmSeenItem
            film={item}
            isFilmFavorite={
              this.props.favoritesFilm.findIndex(
                film => film.id === item.id
              ) !== -1
                ? true
                : false
            }
            isFilmSeen={
              this.props.seenFilm.findIndex(film => film.id === item.id) !== -1
                ? true
                : false
            }
            displayDetailForFilm={this._displayDetailForFilm}
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            !this.props.favoriteList &&
            !this.props.seenList &&
            this.props.page < this.props.totalPages
          ) {
            this.props.loadFilms();
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm,
    seenFilm: state.toggleSeen.seenFilm
  };
};

export default connect(mapStateToProps)(FilmSeenList);
