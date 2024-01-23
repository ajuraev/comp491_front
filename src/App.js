import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen'
import CreateScreen from './Screens/CreateScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SearchScreen from './Screens/SearchScreen';
import FavoriteScreen from './Screens/FavoriteScreen';
import EventInfoScreen from './Screens/EventInfoScreen';
import OtherProfileScreen from './Screens/OtherProfileScren'
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import {  useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useSelector, useDispatch } from 'react-redux';

import * as SplashScreen from 'expo-splash-screen';
import Welcome from './Login/Welcome'


const MyTheme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'black',
    card: 'black',
    text: 'white',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular, Montserrat_700Bold
  });

  const userData = useSelector(state => state.user.userData);

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  const Main = () => {
    const HomeStack = () => {
      return (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EventInfo" component={EventInfoScreen} />
          <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
        </Stack.Navigator>
      );
    };

    const ProfileStack = () => {
      return (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EventInfo" component={EventInfoScreen} />
          <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
        </Stack.Navigator>
      );
    };

    const FavoritesStack = () => {
      return (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Favorites" component={FavoriteScreen} />
          <Stack.Screen name="EventInfo" component={EventInfoScreen} />
          <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
        </Stack.Navigator>
      );
    };



    return <NavigationContainer theme={MyTheme}>
            <Tab.Navigator screenOptions={{
              headerShown: false,
              tabBarShowLabel: false
            }}
            >
              <Tab.Screen
                name="HomeScreen"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <HomeStack {...props}/>}
              </Tab.Screen>
              <Tab.Screen
                name="Search"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="search" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <SearchScreen {...props}/>}
              </Tab.Screen>
              <Tab.Screen
                name="Create"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="add-circle" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <CreateScreen {...props} />}
              </Tab.Screen>
              <Tab.Screen
                name="FavoritesScreen"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="heart" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <FavoritesStack {...props}/>}
              </Tab.Screen>
              <Tab.Screen
                name="ProfileScreen"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <ProfileStack {...props}/>}
              </Tab.Screen>

            </Tab.Navigator>
          </NavigationContainer>
  }

  console.log(fontsLoaded)
  if (!fontsLoaded) {
    return null;
  }

  return (
      <View style={styles.container}>
        {userData ? <Main /> : <Welcome />}
      </View>   

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // You can adjust the resizeMode as needed
  },
  input: {
    height: '5%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    minWidth: '45%'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  postImage: {
    aspectRatio: 1, // 1:1 aspect ratio (square)
    width: '85%',  // You can adjust the width as needed
    alignSelf: 'center', // Center the image horizontally
  }
});
