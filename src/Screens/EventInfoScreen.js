import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, NativeModules, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import the hook for route parameters
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../api/axiosConfig'
import { useState } from 'react';

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
};

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




function EventInfoScreen() {
  const route = useRoute(); // Use the route hook to access parameters
  const navigation = useNavigation();

  const post = route.params?.post || null; // Access the postId parameter
  const user = route.params?.user || null;

  const [hasJoined, setHasJoined] = useState()
  const [hasFavourited, setHasFavourited] = useState()
  const [hasFollowed, setHasFollowed] = useState()
  const [hasPending, setHasPending] = useState()


  useEffect(() => {
    if (post && user) {
      // Check if the user has joined
      console.log("User in info screen",user)
      console.log("Event info screen", post)
      const isUserJoined = post.users_joining.includes(user.email);
      
      setHasJoined(isUserJoined);
  
      const isFollowed = user.friends.includes(post.ownerId); 
      setHasFollowed(isFollowed)
      console.log("Is followed", isFollowed)

      const isPending = user.out_requests.includes(post.ownerId);
      setHasPending(isPending)

      // Check if the user has favorited
      const isUserFavourited = post.users_liked.includes(user.email);
      setHasFavourited(isUserFavourited);
    }
  }, [post, user]);


  const handleJoinEvent = (token, eventId) => {

    if(hasJoined){
      api.delete('/Event/RemoveUserJoinFromEvent', {data: { userToken: token, eventId: eventId }})
      .then((response) => {
        console.log("Success:", response.data);
        setHasJoined(!hasJoined)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else{
      api.post('/Event/JoinEvent', {userToken: token, eventId: eventId})
      .then((response) => {
        console.log("Success:", response.data);
        setHasJoined(!hasJoined)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    
  }
  
  const handleFavouriteEvent = (token, eventId) => {
  
    if(hasFavourited){
      api.delete('/Event/RemoveUserLikeFromPost', {data: { userToken: token, eventId: eventId }})
      .then((response) => {
        console.log("Success:", response.data);
        setHasFavourited(!hasFavourited)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else{
    api.post('/Event/AddUserLikeToPost', {userToken: token, eventId: eventId})
      .then((response) => {
        console.log("Success:", response.data);
        setHasFavourited(!hasFavourited)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  }

  const handleFollowUser = (token, email) => {

    console.log(hasFollowed, token, email)
    if(hasFollowed){
      api.delete(`/Event/RemoveFriend?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasFollowed(!hasFollowed)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else if(hasPending){
      api.post(`/Event/CancelFriendRequest?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasPending(!hasPending)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else {
      api.post(`/Event/SendFriendRequest?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasPending(!hasFollowed)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    
  }

  const updateUser = (token) => {
    api.get('/Event/loggedUser', {
      params: {
        token: token,
      },
    })
    .then((response) => {
        console.log('Data:', response.data);
        setUser({...response.data, token: token})
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  const handleDelete = () => {
    
    api.delete(`/Event/post?postId=${post.postId}`)
    .then((response) => {
        console.log('Data:', response.data);
        navigation.navigate('Home')
      })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  return (
    <View style={styles.container}>
      <View style={{width: '90%'}}>
        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')} 
            style={{marginVertical: 10}}> 
            <Ionicons name="arrow-back" color={'white'} size={40} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={user.email == post.ownerId ? handleDelete : null} 
            style={{marginVertical: 10}}> 
            <Ionicons name="trash" color={user.email == post.ownerId ? 'white' : 'black'} size={40} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          <Text style={styles.title}>{post.title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OtherProfile', {email: post.ownerId})} style={{...styles.button, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              {/* <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png' }} style={styles.avatarImage} /> */}
              <Text style={{ ...styles.text, fontSize: 14, color: 'black' }}>{post.ownerId}</Text>
            </View>
            <TouchableOpacity onPress={() => handleFollowUser(user.token,post.ownerId)} style={{...styles.followButton, backgroundColor: hasFollowed ? 'red' : (hasPending ? 'green' :'#3659e3')}}>
              <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>{hasFollowed ? "Unfollow" : (hasPending ? "Pending" : "Follow")}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Ionicons name="calendar" color={'white'} size={30} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>{formatDate(post.event_date)}</Text>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 12, color: 'white' }}>{formatTime(post.event_date)}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ionicons name="location" color={'white'} size={30} />
            <View style={{marginLeft: 10, justifyContent:'center'}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>Event Location: {post.location}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ionicons name="cash" color={'white'} size={30} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>Price</Text>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 12, color: 'white' }}>{post.price} ₺</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 40 }}>
            <TouchableOpacity onPress={() => handleJoinEvent(user.token,post.postId)} style={{ ...styles.followButton, width: '40%', backgroundColor: hasJoined ? 'red' : '#3659e3'}}>
              <Text style={{ ...styles.text, fontSize: 14, color: 'white', textAlign: 'center' }}>{hasJoined ? "Leave" : "Join"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFavouriteEvent(user.token,post.postId)} style={{ ...styles.followButton, width: '40%', backgroundColor: hasFavourited ? 'red' : '#3659e3'}}>
              <Text style={{ ...styles.text, fontSize: 14, color: 'white', textAlign: 'center' }}>{hasFavourited ? "Remove from Favorites" : "Add to Favorites"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
  title:{
      fontSize: 28,
      color: 'white',
      paddingVertical: 10,
      marginVertical: 15,
      fontFamily: 'Montserrat_400Regular'
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
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'white',
      minWidth: '45%'
  },
  followButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#3659e3',
    borderRadius: 10,
    minWidth: '20%'
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
      borderRadius: 15,
  },
  avatarImage: {
    aspectRatio: 1, // 1:1 aspect ratio (square)
    width: '20%',  // You can adjust the width as needed
    alignSelf: 'center', // Center the image horizontally
    borderRadius: 5,
}
  });

export default EventInfoScreen;
