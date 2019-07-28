import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from "react-navigation";
import { white,inActiveNav,darkBlue } from "../utils/colors";
import DeckListView from "./DeckListView";
import NewDeckView from "./NewDeckView";
import DeckView from "./DeckView";
import QuizView from "./QuizView";
import NewQuestionView from "./NewQuestionView";
import { MaterialCommunityIcons, FontAwesome, } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator(
  {
    DeckListView: {
      screen: DeckListView,
      navigationOptions: {
        tabBarLabel: "Decks",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="cards" size={40} color={tintColor} />
        )
      }
    },
    NewDeckView: {
      screen: NewDeckView,
      navigationOptions: {
        tabBarLabel: "Add Deck",
         tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="plus-square" size={40} color={tintColor} />
        ),
      }
    }
  },
  {
    navigationOptions: {
      header: null
    },
    tabBarOptions: {
      activeTintColor:  white,
      inactiveTintColor:  inActiveNav,
      style: {
        height: 56,
        backgroundColor: darkBlue,
        shadowColor: "rgba(0, 0, 0, 0.24)",
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 1
      }
    }
  }
);

const MainNavigator = createStackNavigator({
  Home: {
    screen: Tabs
  },
  DeckView: {
    screen: DeckView,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.deck.title}`,
      headerTitleStyle: {
        alignSelf: "center"
      },
      headerRight: <View />,
      headerTintColor: white,
      headerStyle: {
        backgroundColor: darkBlue
      }
    })
  },
  QuizView: {
    screen: QuizView,
    navigationOptions: {
      title: "Quiz",
      headerTitleStyle: {
        alignSelf: "center"
      },
      headerRight: <View />,
      headerTintColor: white,
      headerStyle: {
        backgroundColor: darkBlue
      }
    }
  },
  NewQuestionView: {
    screen: NewQuestionView,
    navigationOptions: {
      title: "Add card",
      headerTitleStyle: {
        alignSelf: "center"
      },
      headerRight: <View />,
      headerTintColor: white,
      headerStyle: {
        backgroundColor: darkBlue
      }
    }
  }
});

export default createAppContainer(MainNavigator);
