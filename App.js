import React from 'react';
import { Easing, Animated } from 'react-native';
import { useScreens } from 'react-native-screens';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import PairingScreen from './screen/PairingScreen';
import HomeLoadingScreen from './screen/HomeLoadingScreen';
import HomeScreen from './screen/HomeScreen';

useScreens();

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 800,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { position, scene } = sceneProps;
      const thisSceneIndex = scene.index;
      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1],
      });
      return { opacity };
    },
  }
}

const PairingStack = createStackNavigator({
  PairingScreen
}, {
    headerMode: 'none',
    initialRouteName: "PairingScreen",
    transitionConfig
  });

const HomeStack = createStackNavigator({
  HomeScreen
}, {
    headerMode: 'none',
    initialRouteName: "HomeScreen",
    transitionConfig
  });

const AppNavigator = createSwitchNavigator({
  HomeLoadingScreen,
  PairingStack,
  HomeStack
}, {
    initialRouteName: 'HomeLoadingScreen',
  });

const AppContainer = createAppContainer(AppNavigator);

export default () => <AppContainer />;