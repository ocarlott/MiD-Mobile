import React from 'react';
import { Easing, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundJob from 'react-native-background-job';
import BleManager, { BleEmitter } from '../services/BLEService';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { useScreens } from 'react-native-screens';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import PairingScreen from './screen/PairingScreen';
import HomeLoadingScreen from './screen/HomeLoadingScreen';
import HomeScreen from './screen/HomeScreen';
import ConnectScreen from './screen/ConnectScreen';

useScreens();

const store = createStore(reducers);

const backgroundJob = {
  jobKey: "connectAvailableLocks",
  job: () => {
    AsyncStorage.getItem("locks", (str) => {
      if (str) {
        let locks = JSON.parse(str);

      }
    }).catch(() => {
      console.log("No locks found!");
    });
  }
};

BackgroundJob.register(backgroundJob);


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
  PairingScreen,
  ConnectScreen
}, {
    headerMode: 'none',
    initialRouteName: "PairingScreen",
    // transitionConfig
  });

const HomeStack = createStackNavigator({
  HomeScreen
}, {
    headerMode: 'none',
    initialRouteName: "HomeScreen",
    // transitionConfig
  });

const AppNavigator = createSwitchNavigator({
  HomeLoadingScreen,
  PairingStack,
  HomeStack
}, {
    initialRouteName: 'HomeLoadingScreen',
  });

const AppContainer = createAppContainer(AppNavigator);

export default () => <Provider store={store}><AppContainer /></Provider>;