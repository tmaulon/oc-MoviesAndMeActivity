// Navigation/Navigations.js

import React from "react";
import { StyleSheet, Image } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
import Search from "../Components/Search";
import FilmDetail from "../Components/FilmDetail";
import Favorites from "../Components/Favorites";
import News from "../Components/News";
import Seen from "../Components/Seen";

const FilmDetailNavigation = {
  screen: FilmDetail,
  navigationOptions: {
    title: "En savoir plus",
    headerStyle: {
      backgroundColor: "#fff",
    },
    headerTintColor: '#0000ff',
    headerTitleStyle: {
      fontSize: 16,
      color: "#0000ff",
      fontWeight: "bold",
    },
  }
}
const HeaderNavigation = (screenName, navigationOptionsTitle) => (
  {
    screen: screenName,
    navigationOptions: {
      title: navigationOptionsTitle,
      headerStyle: {
        backgroundColor: "#0000ff",
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
      },
    }
  }
);
const SearchStackNavigator = createStackNavigator({
  Search: HeaderNavigation(Search, "Movies and Me"),
  FilmDetail: FilmDetailNavigation,
});

const FavoritesStackNavigator = createStackNavigator({
  Favorites: HeaderNavigation(Favorites, "Mes Films Favoris"),
  FilmDetail: FilmDetailNavigation,
});

const NewsStackNavigator = createStackNavigator({
  News: HeaderNavigation(News, "Les Derniers Films"),
  FilmDetail: FilmDetailNavigation,
});

const SeenStackNavigator = createStackNavigator({
  Seen: HeaderNavigation(Seen, "Mes Films Vus"),
  FilmDetail: FilmDetailNavigation,
});

const MoviesTabNavigator = createBottomTabNavigator(
  {
    Search: {
      screen: SearchStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require("../Images/ic_search.png")}
              style={styles.icon}
            />
          );
        }
      }
    },
    Favorites: {
      screen: FavoritesStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require("../Images/ic_favorite.png")}
              style={styles.icon}
            />
          );
        }
      }
    },
    News: {
      screen: NewsStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require("../Images/ic_fiber_new.png")}
              style={styles.icon}
            />
          );
        }
      }
    },
    Seen: {
      screen: SeenStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require("../Images/ic_check.png")}
              style={styles.icon}
            />
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: "#DDDDDD",
      inactiveBackgroundColor: "#FFFFFF",
      showLabel: false,
      showIcon: true
    }
  }
);

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  },
  stackNavigator: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#0000ff",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
});

export default createAppContainer(MoviesTabNavigator);
