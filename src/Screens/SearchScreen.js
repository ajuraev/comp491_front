import { StyleSheet, Text, View, TextInput, TouchableOpacity,KeyboardAvoidingView,  SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import EventList from "../components/EventList";


function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigation = useNavigation();
    const [content, setContent] = useState(0)


    const userData = useSelector(state => state.user.userData);

    const Content = () => {
      if(content == 0){

        return (
          <View style={{width:'93%'}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
                  <TextInput
                      style={styles.input}
                      placeholder="Search"
                      onChangeText={handleSearch}
                      value={searchQuery}
                      placeholderTextColor='grey'
                  />
                  {users.map((user, index) => (
                      <TouchableOpacity  
                          onPress={() => navigation.navigate('OtherProfile', {email: user.email})}
                          key={index} style={{ flexDirection: 'row', width: '100%',   padding: 10, borderRadius: 10 }}>
                          <View style={{width: '10%', justifyContent: 'center'}}>
                              <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
                          </View>
                          <View style={{flex: 1, marginLeft: 10}}>
                              <Text style={styles.userDisplayName}>{user.displayName}</Text>
                              <Text style={styles.userSurname}>{user.username}</Text>
                          </View>
                      </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

        )
      }else if(content == 1){
        return  <View style={{flex:1, marginTop: 15, alignItems: 'center'}}>
                  <View style={{borderWidth: 1, borderColor: 'white', borderRadius: 10, width: '90%'}}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue, itemIndex) => handleCategoryChange(itemValue)}
                      dropdownIconColor='white'
                      style={{ color: 'white', minWidth:'100%'}}
                    >
                      <Picker.Item label="Select a category" value=" " />
                      <Picker.Item label="Sports" value="Sports" />
                      <Picker.Item label="Football" value="Football" />
                      <Picker.Item label="Music" value="Music" />
                      <Picker.Item label="Basketball" value="Basketball" />
                    </Picker>
                  </View>
                  <EventList navigation={navigation} posts={posts}/>
                </View>
      }
  }

    const handleCategoryChange = (itemValue) => {
      setSelectedCategory(itemValue)

      api.get(`/Event/SearchByCategory?categories=${itemValue}&token=${userData.token}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Posts:', posts);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    }

    const handleSearch = (query) => {
      setSearchQuery(query);
      console.log(userData)

      api.get(`/Event/SearchUsers?searchString=${query}`)
      .then((response) => {
        // Handle the successful response here
        setUsers(response.data)
        console.log('Data:', users);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    };
  
    return (
            <View style={styles.container}>
                <View style={{flex:1, width: '100%', marginTop: 20}}>
                    <Text style={styles.title}>Search</Text>
                    <View style={{flexDirection: 'row', marginLeft: 15}}>
                        <TouchableOpacity onPress={() => setContent(0)}>
                            <Text style={{...styles.textButton, textDecorationLine: content == 0 ? 'underline' : 'none'}}>
                                Users
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContent(1)}>
                        <Text style={{...styles.textButton, textDecorationLine: content == 1 ? 'underline' : 'none'}}>
                                Events
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center'}}>
                        <Content/>
                    </View>
                </View>
            </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
    },
    imageBackground: {
      flex: 1,
      resizeMode: 'cover', // You can adjust the resizeMode as needed
    },
    title:{
        fontSize: 28,
        color: 'white',
        paddingVertical: 10,
        fontFamily: 'Montserrat_400Regular',
        marginLeft: 15
    },
    input: {
        height: 40,
        width: '100%',
        color: 'white',
        marginVertical: 5,
        borderBottomWidth: 1, // Add a bottom border
        borderBottomColor: '#ab162b', // Set the color for the bottom border
        fontFamily: 'Montserrat_400Regular',
        fontSize: 20

    },
    textButton: {
      fontSize: 16,
      color: '#ab162b',
      fontFamily: 'Montserrat_400Regular',
      paddingRight: 15,
  },
    divider: {
        marginTop: '3%',
        borderBottomColor: '#393e46',
        borderBottomWidth: 1,
        alignSelf:'stretch'
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
    userDisplayName: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    userSurname: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    profileImage: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '100%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 100
    }
  });

export default SearchScreen
