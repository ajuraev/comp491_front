import { View, Text, StyleSheet, NativeModules, Image, TouchableOpacity,ScrollView } from "react-native"
const { StatusBarManager } = NativeModules;
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig'
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



function FavoriteScreen(props){
    const [favouriteEvents, setFavouriteEvents] = useState([])
    const [clubs, setClubs] = useState([])
    const [friends, setFriends] = useState([])
    const [content, setContent] = useState(0)
    const user = props.user
    const navigation = useNavigation();

    const EventsList = ({posts}) => {  
        return(
            <ScrollView contentContainerStyle={{ width: '100%', flexGrow: 1, alignItems: 'center'}}>
                {posts.map((post, index) => (
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('EventInfo', { post: post})} 
                    key={index} style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', margin: 10, padding: 10, backgroundColor: 'black', borderRadius: 10 }}>
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
        )
    }

    const Content = () => {
        if(content == 0){
            return <EventsList posts={favouriteEvents}/>
        }
    }

    useEffect(() => {
        console.log("Mounting favouriteScreen")
        api.get(`/Event/LikedPostsOfUser?token=${user.token}`)
          .then((response) => {
            setFavouriteEvents(response.data)
            console.log('Data:', response.data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }, []);

    return(
        <View style={styles.container}> 
            <View style={{width: '90%', marginTop: 20}}>
                <Text style={styles.title}>Favorites</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => setContent(0)}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00adb5',
                            fontFamily: 'Montserrat_400Regular',
                            paddingRight: 15
                            }}>
                            Events
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setContent(1)}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00adb5',
                            paddingRight: 15,
                            fontFamily: 'Montserrat_400Regular'
                            }}>
                            Clubs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setContent(2)}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00adb5',
                            fontFamily: 'Montserrat_400Regular'
                            }}>
                            Friends
                        </Text>
                    </TouchableOpacity>
                </View>
                <Content/>
            </View>
        </View>
    )
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

export default FavoriteScreen