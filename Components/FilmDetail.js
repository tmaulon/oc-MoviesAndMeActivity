// Components/FilmDetail.js

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Button,
  Animated
} from "react-native";
import { getFilmDetailFromApi, getImageFromApi } from "../API/TMDBApi";
import moment from "moment";
import numeral from "numeral";
import { connect } from "react-redux";
import EnlargeShrink from "../Animations/EnlargeShrink";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

class FilmDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params.film != undefined && Platform.OS === "ios") {
      return {
        headerRight: (
          <TouchableOpacity
            style={styles.share_touchable_headerrightbutton}
            onPress={() => params.shareFilm()}
          >
            <Image
              style={styles.share_image}
              source={require("../Images/ic_share.png")}
            />
          </TouchableOpacity>
        )
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      film: undefined,
      isLoading: false,
      scrollOffset: new Animated.Value(0),
    };

    this._toggleFavorite = this._toggleFavorite.bind(this);
    this._toggleSeen = this._toggleSeen.bind(this);
    this._shareFilm = this._shareFilm.bind(this);
  }

  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    });
  }

  componentDidMount() {
    console.log("film detail props => ", this.props);

    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(
      item => item.id === this.props.navigation.state.params.idFilm
    );
    if (favoriteFilmIndex !== -1) {
      this.setState(
        {
          film: this.props.favoritesFilm[favoriteFilmIndex]
        },
        () => {
          this._updateNavigationParams();
        }
      );
      return;
    }
    this.setState({ isLoading: true });
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(
      data => {
        this.setState(
          {
            film: data,
            isLoading: false
          },
          () => {
            this._updateNavigationParams();
          }
        );
      }
    );
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  _toggleFavorite() {
    const action = { type: "TOGGLE_FAVORITE", value: this.state.film };
    this.props.dispatch(action);
  }

  _displayFavoriteIcon() {
    var iconName = "hearto";
    var shouldEnlarge = false; // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton, celui-ci s'agrandisse => shouldEnlarge à true
    if (
      this.props.favoritesFilm.findIndex(
        item => item.id === this.state.film.id
      ) !== -1
    ) {
      iconName = "heart";
      shouldEnlarge = true; // Si le film est dans les favoris, on veut qu'au clic sur le bouton, celui-ci se rétrécisse => shouldEnlarge à false
    }
    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <AntDesignIcon style={styles.header_buttons_icons} name={iconName} size={shouldEnlarge ? 40 : 30} color="#0000ff" />
      </EnlargeShrink>
    );
  }

  _displaySeenIcon() {
    var iconName = "eyeo";
    var shouldEnlarge = false; // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton, celui-ci s'agrandisse => shouldEnlarge à true
    if (
      this.props.seenFilm.findIndex(
        item => item.id === this.state.film.id
      ) !== -1
    ) {
      iconName = "eye";
      shouldEnlarge = true; // Si le film est dans les favoris, on veut qu'au clic sur le bouton, celui-ci se rétrécisse => shouldEnlarge à false
    }
    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <AntDesignIcon style={styles.header_buttons_icons} name={iconName} size={shouldEnlarge ? 40 : 30} color="#0000ff" />
      </EnlargeShrink>
    );
  }

  _displayShareIcon() {
    var iconName = "sharealt";
    return (
      <AntDesignIcon style={styles.header_buttons_icons} name={iconName} size={30} color="#0000ff" />
    );
  }

  _displaySeenText() {
    var seenText = "Marquer comme vu";
    if (
      this.props.seenFilm.findIndex(item => item.id === this.state.film.id) !==
      -1
    ) {
      seenText = "Non vu";
    }
    return <Text>{seenText}</Text>;
  }

  _displayFilm() {
    const { film, scrollOffset } = this.state;
    const expandedHeaderHeight = 400;
    const collapsedHeaderHeight = 64;
    const titleHeight = 44;
    const scrollSpan = expandedHeaderHeight - collapsedHeaderHeight;
    // Utilisation d'Animated.event pour mettre à jour scrollOffset lors de l'évènement onScroll
    const scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollOffset } } }],
      { useNativeDriver: true }
    );

    if (film != undefined) {
      return (
        <Animated.ScrollView
          style={styles.scrollview_container}
          // Mis à jour de scrollOffset sur l'évènement onScroll
          onScroll={scrollEvent}
          // scrollEventThrottle={1} est nécessaire afin d'être notifié de tous les évènements de défilement
          scrollEventThrottle={1}>
          <Animated.View style={
            // [
            // styles.image_header_wrapper,
            {
              height: expandedHeaderHeight,
              zIndex: 100,
              overflow: "hidden",
              // Déplacement du header vers le haut afin de réduire sa hauteur
              transform: [
                {
                  translateY: Animated.subtract(
                    scrollOffset,
                    scrollOffset.interpolate({
                      inputRange: [0, scrollSpan],
                      outputRange: [0, scrollSpan],
                      extrapolate: "clamp",
                    })
                  ),
                },
              ],
            }
            // ]
          }>
            <Animated.Image
              style={
                [
                  styles.image_header,
                  {
                    transform: [
                      {
                        translateY: scrollOffset.interpolate({
                          inputRange: [0, scrollSpan],
                          outputRange: [0, scrollSpan / 2],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }
                ]
              }
              source={{ uri: getImageFromApi(film.backdrop_path) }}
            />
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "black",
                  // Apparition d'un overlay noir semi-transparent
                  opacity: scrollOffset.interpolate({
                    inputRange: [scrollSpan / 2, scrollSpan],
                    outputRange: [0, 0.85],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
            <Animated.Text
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 16,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
                // Déplacement du titre vers le haut afin de le faire apparaitre progressivement
                transform: [
                  {
                    translateY: scrollOffset.interpolate({
                      inputRange: [scrollSpan, scrollSpan + titleHeight],
                      outputRange: [titleHeight, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              {film.title}
            </Animated.Text>
          </Animated.View>
          <View style={{ padding: 20 }}>
            <View style={styles.header_container}>
              <Text style={styles.title_text}>{film.title}</Text>
              <View style={styles.header_buttons_container}>
                <View style={styles.header_button_container}>
                  <TouchableOpacity style={styles.header_button}
                    onPress={() => this._toggleFavorite()}
                  >
                    {this._displayFavoriteIcon()}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.header_button}
                    onPress={() => this._toggleSeen()}
                  >
                    {this._displaySeenIcon()}
                  </TouchableOpacity>
                </View>
                <View
                  style={styles.header_button_share_container}>
                  <TouchableOpacity
                    onPress={() => this._shareFilm()}
                  >
                    {this._displayShareIcon()}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.infos_container}>
              <Text style={styles.default_text}>
                Note : {" "}
                <Text style={styles.info_text}>
                  {film.vote_average} / 10
            </Text>
              </Text>
              <Text style={styles.default_text}>
                Nombre de votes : {" "}
                <Text style={styles.info_text}>
                  {film.vote_count}
                </Text>
              </Text>
              <Text style={styles.default_text}>
                Sorti le {" "}
                <Text style={styles.info_text}>
                  {moment(new Date(film.release_date)).format("DD/MM/YYYY")}
                </Text>
              </Text>
              <Text style={styles.default_text}>
                Budget : {" "}
                <Text style={styles.info_text}>
                  {numeral(film.budget).format("0,0[.]00 $")}
                </Text>
              </Text>
              <Text style={styles.default_text}>
                Genre(s) : {" "}
                <Text style={styles.info_text}>
                  {film.genres
                    .map(function (genre) {
                      return genre.name;
                    })
                    .join(" / ")}
                </Text>
              </Text>
              <Text style={styles.default_text}>
                Companie(s) : {" "}
                <Text style={styles.info_text}>
                  {film.production_companies
                    .map(function (company) {
                      return company.name;
                    })
                    .join(" / ")}
                </Text>
              </Text>
            </View>
            <View style={styles.description_container}>
              <Text style={styles.subtitle_text}>Resumé</Text>
              <Text style={styles.description_text}>{film.overview}</Text>
            </View>
          </View>
        </Animated.ScrollView >
      );
    }
  }

  _shareFilm() {
    const { film } = this.state;
    Share.share({ title: film.title, message: film.overview });
  }

  _displayFloatingActionButton() {
    const { film } = this.state;
    if (film != undefined && Platform.OS === "android") {
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}
        >
          <Image
            style={styles.share_image}
            source={require("../Images/ic_share.png")}
          />
        </TouchableOpacity>
      );
    }
  }

  _toggleSeen() {
    console.log("toggleSeen");

    const action = { type: "TOGGLE_SEEN", value: this.state.film };
    this.props.dispatch(action);
  }

  _displayFixedActionButton() {
    const { film } = this.state;
    if (film != undefined) {
      return (
        <TouchableOpacity
          style={styles.seen_touchable_fixedactionbutton}
          onPress={() => this._toggleSeen()}
        >
          <Text style={styles.seen_touchable_fixedactionbutton_text}>
            {this._displaySeenText()}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
        {this._displayFloatingActionButton()}
        {this._displayFixedActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollview_container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image_header_wrapper: {
    height: 169,
    margin: 5
  },
  image_header: {
    width: "100%",
    height: "100%",
  },
  header_container: {
    marginBottom: 10,
  },
  infos_container: {
    marginBottom: 10,
  },
  description_container: {
    marginBottom: 10,
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 30,
    flex: 1,
    flexWrap: "wrap",
    color: "#000000",
    textAlign: "left"
  },
  subtitle_text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    color: "#000000",
    textAlign: "left"
  },
  header_buttons_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  header_button_container: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  header_button: {
    alignItems: "center",
  },
  header_button_share_container: {
    alignItems: "flex-end",
  },
  header_buttons_icons: {
    flex: 1,
  },
  description_text: {
    fontStyle: "italic",
    color: "#666666",
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  info_text: {
    fontWeight: "bold",
  },
  share_touchable_floatingactionbutton: {
    position: "absolute",
    width: 60,
    height: 60,
    right: 10,
    bottom: 50,
    borderRadius: 30,
    backgroundColor: "#0000ff",
    justifyContent: "center",
    alignItems: "center"
  },
  seen_touchable_fixedactionbutton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#0000ff",
    color: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 10,
  },
  seen_touchable_fixedactionbutton_text: {
    color: "#fff"
  },
  share_touchable_headerrightbutton: {
    marginRight: 8
  },
  share_image: {
    width: 30,
    height: 30
  }
});

const mapStateToProps = state => {
  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm,
    seenFilm: state.toggleSeen.seenFilm
  };
};

export default connect(mapStateToProps)(FilmDetail);
