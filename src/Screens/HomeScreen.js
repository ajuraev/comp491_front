import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import api from '../api/axiosConfig'
import { useEffect, useState } from "react";
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { formatTime, formatDate } from '../utils/dateHelpers'; 



function HomeScreen(props) {
  const [text, onChangeText] = useState('Search by event or club...');
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState(0)
  const [openedEvent, setOpenedEvent] = useState(null)
  const isFocused = useIsFocused();

  const userData = useSelector(state => state.user.userData);


  const navigation = useNavigation();

  const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
  };

  useEffect(() => {
    console.log("User in homescreen", userData)
    api.get(`Event/PostsbyToken?token=${userData.token}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Data:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, [props, isFocused]);

  const handleAll = () => {
    setContent(0)
    api.get(`Event/PostsbyToken?token=${userData.token}`)
    .then((response) => {
      // Handle the successful response here
      setPosts(response.data)
      console.log('Data:', response.data);
    })
    .catch((error) => {
      // Handle any errors here
      console.error('Error:', error);
    });
  }

  const handleFriends = () => {
    setContent(1)
    api.get(`Event/PostsOfFriends?token=${userData.token}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Data:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }

  return (
    <View style={styles.container}>
      <View 
        style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}  
      >   
        <TouchableOpacity onPress={handleAll} style={styles.button}>
          <Text style={{...styles.text, textDecorationLine: content == 0 ? 'underline' : 'none', }}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFriends} style={styles.button}>
        <Text style={{...styles.text, textDecorationLine: content == 1 ? 'underline' : 'none', }}>Friends</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider}/>
      <View style={{ flex: 1, height: '90%' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          {posts.map((post, index) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('EventInfo', { post: post})} 
              key={index} style={{ flexDirection: 'row', width: '95%', justifyContent: 'center', margin: 10, padding: 10, backgroundColor: 'black', borderRadius: 10 }}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.postDate}>{formatTime(post.event_date)}, {post.location}</Text>
                  <Text style={styles.postDate}>{formatDate(post.event_date)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                    <Ionicons name="person-outline" color={'white'} size={10} />
                    <Text style={styles.participantCount}>{post.users_joining.length}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 0 }}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postDate}>{post.ownerId}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
  },
divider: {
  marginTop: '3%',
  borderBottomColor: '#393e46',
  borderBottomWidth: 1,
  alignSelf:'stretch'
},
input: {
    height: 40,
    margin: 12,
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
    color: 'white',
    padding: 10,
    fontFamily: 'Montserrat_400Regular'
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

export default HomeScreen