import { StyleSheet, Text, View, TextInput, TouchableOpacity,KeyboardAvoidingView,  SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig'


function SearchScreen({user}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([])

    const handleSearch = (query) => {
      setSearchQuery(query);
      console.log(user)

      api.get(`/Event/PostsOfUser?token=${user.token}&email=${query}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Data:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    };
  
    return (
            <View style={styles.container}>
                <View style={{width: '90%'}}>
                    <TextInput
                    style={styles.input}
                    placeholder="Search"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    />
                    <View style={{ flex: 1, height: '90%' }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                        {posts.map((post, index) => (
                            <Pressable key={index} style={{ flexDirection: 'row', width: '95%', justifyContent: 'center', margin: 10, padding: 10, backgroundColor: 'black', borderRadius: 10 }}>
                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                <View>
                                <Text style={styles.postDate}>21:30, SNA A43, Wed, Oct 11</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                                    <Ionicons name="person-outline" color={'white'} size={10} />
                                    <Text style={styles.participantCount}>147</Text>
                                </View>
                                </View>
                                <View style={{ marginTop: 0 }}>
                                <Text style={styles.postTitle}>{post.title}</Text>
                                <Text style={styles.postTitle}>{post.description}</Text>
                                <Text style={styles.postDate}>KU Music Club</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                <Text style={styles.postParticipants}>unal, gokber, abdulla and others are joining</Text>
                                <Ionicons name="bookmark-outline" color={'red'} size={20} />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                            </View>
                            </Pressable>
                        ))}
                        </ScrollView>
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
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
    },
    imageBackground: {
      flex: 1,
      resizeMode: 'cover', // You can adjust the resizeMode as needed
    },
    input: {
        height: 40,
        width: '100%',
        marginVertical: 25,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        color: 'black',
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
    postTitle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
      postDate: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
      postParticipants: {
        fontSize: 8,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
      participantCount: {
        fontSize: 9,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
      postImage: {
          aspectRatio: 4/3, // 1:1 aspect ratio (square)
          width: '100%',  // You can adjust the width as needed
          alignSelf: 'center', // Center the image horizontally
          borderRadius: 5
      }
  });

export default SearchScreen
