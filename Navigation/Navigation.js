// Navigation/Navigations.js

import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  ScrollView,
  createDrawerNavigator,
  SafeAreaView,
  createAppContainer
} from "react-navigation";
import Search from "../Components/Search";
import FilmDetail from "../Components/FilmDetail";
import Favorites from "../Components/Favorites";
import News from "../Components/News";
import Seen from "../Components/Seen";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
const MoviesHeaderNavigation = (screenName, navigationOptionsTitle) => (
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
  Search: MoviesHeaderNavigation(Search, "Movies and Me"),
  FilmDetail: FilmDetailNavigation,
});

const FavoritesStackNavigator = createStackNavigator({
  Favorites: MoviesHeaderNavigation(Favorites, "Mes Films Favoris"),
  FilmDetail: FilmDetailNavigation,
});

const NewsStackNavigator = createStackNavigator({
  News: MoviesHeaderNavigation(News, "Les Derniers Films"),
  FilmDetail: FilmDetailNavigation,
});

const SeenStackNavigator = createStackNavigator({
  Seen: MoviesHeaderNavigation(Seen, "Mes Films Vus"),
  FilmDetail: FilmDetailNavigation,
});

const MoviesTabNavigator = createBottomTabNavigator(
  {
    Search: {
      screen: SearchStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <AntDesign name="search1" size={25} color={tintColor} />
      }
    },
    Favorites: {
      screen: FavoritesStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <AntDesign name="heart" size={25} color={tintColor} />
      }
    },
    News: {
      screen: NewsStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="new-box" size={25} color={tintColor} />
      }
    },
    Seen: {
      screen: SeenStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <AntDesign name={tintColor === "#fff" ? "checkcircle" : "checkcircleo"} size={25} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "#fff",
      inactiveTintColor: "rgba(0, 0, 120, 1)",
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: '#0000ff', // TabBar background
      }
    }
  }
);

const CustomDrawerComponent = props => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ height: 150, backgroundColor: '#0000ff', padding: 15, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 16 }}>Menu</Text>
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
);
const MoviesDrawerNavigation = createDrawerNavigator(
  {
    Search: {
      screen: SearchStackNavigator
    },
    Favorites: {
      screen: SearchStackNavigator
    },
    News: {
      screen: SearchStackNavigator
    },
    Seen: {
      screen: SearchStackNavigator
    },
  },
  {
    drawerWidth: 300,
    contentComponent: CustomDrawerComponent
  }
);
const AppDrawer = createAppContainer(MoviesDrawerNavigation);

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  },
});

export default createAppContainer(MoviesTabNavigator);
