import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import api from '../api/axiosConfig'
import { useEffect, useState } from "react";
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const formatTime = (dateString) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Europe/Istanbul', // Set the desired time zone
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  return formattedTime;
};

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
};


function HomeScreen(props) {
  const [text, onChangeText] = useState('Search by event or club...');
  const [posts, setPosts] = useState([])
  const [openedEvent, setOpenedEvent] = useState(null)
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
  };

  useEffect(() => {
    console.log("Mounting home")
    // Perform GET request when the component mounts
    api.get('/Event')
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

  return (
    <View style={styles.container}>
      <View 
        style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}  
      >   
        <Pressable style={styles.button}>
          <Text style={styles.text}>For You</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.text}>All</Text>
        </Pressable>
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
                  <Text style={styles.postTitle}>{post.description}</Text>
                  <Text style={styles.postDate}>{post.ownerId}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                  <Text style={styles.postParticipants}>unal, gokber, abdulla and others are joining</Text>
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