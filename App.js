import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Screens/HomeScreen'
import CreateScreen from './src/Screens/CreateScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import SearchScreen from './src/Screens/SearchScreen';
import FavoriteScreen from './src/Screens/FavoriteScreen';
import EventInfoScreen from './src/Screens/EventInfoScreen';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import {  useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

import * as SplashScreen from 'expo-splash-screen';
import Welcome from './src/Login/Welcome'


const MyTheme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: '#222831',
    card: '#222831',
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
  const [user, setUser] = useState(false)
 
  const Main = () => {
    const HomeStack = ({user}) => {
      return (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user: user }}/>
          <Stack.Screen name="EventInfo" component={EventInfoScreen} initialParams={{ user: user}}/>
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
                name="Home"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <HomeStack {...props} user={user} />}
              </Tab.Screen>
              <Tab.Screen
                name="Search"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="search" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <SearchScreen {...props} user={user} />}
              </Tab.Screen>
              <Tab.Screen
                name="Create"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="add-circle" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <CreateScreen {...props} user={user} />}
              </Tab.Screen>
              <Tab.Screen
                name="Favorites"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="heart" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <FavoriteScreen {...props} user={user} />}
              </Tab.Screen>
              <Tab.Screen
                name="Profile"
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <ProfileScreen {...props} user={user} />}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
  }

  console.log(fontsLoaded)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? <Main /> : <Welcome setUser={setUser}/>}
    </SafeAreaView>      

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
