import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image,NativeModules } from "react-native"
import { Ionicons } from '@expo/vector-icons';
const { StatusBarManager } = NativeModules;
import { useState, useEffect } from "react";
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

function ProfileScreen(props){
    const [posts, setPosts] = useState([])
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const user = props.user

    useEffect(() => {
        console.log("Mounting profile")
        // Perform GET request when the component mounts
        api.get(`/Event/PostsOfUser?token=${user.token}&email=${user.email}`)
        .then((response) => {
            // Handle the successful response here
            setPosts(response.data)
            console.log('Data posts in profile:', response.data);
            console.log(posts.length)
          })
          .catch((error) => {
            // Handle any errors here
            console.error('Error:', error);
          });
    }, [props, isFocused]);

    return(
        <View style={styles.container}>
            <View style={styles.container1}>
                <TouchableOpacity  style={styles.iconButton}>
                    <Ionicons name="arrow-back-outline" color={"white"} size={25} />
                </TouchableOpacity>
                <Text style={styles.text}>@{user.username}</Text>
                <TouchableOpacity  style={styles.iconButton}>
                    <Ionicons name="exit-outline" color={"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container2}>
                <Image source={{uri: user.profileImageUrl}} style={styles.profileImg}/>
                <View style={{flex:1,flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor:'yellow'}}>
                    <View style={{width:'100%', flexDirection:'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.textNum}>{user.friends.length}</Text>
                            <Text style={styles.textFollow}>friends</Text>
                        </View>
                        <TouchableOpacity  style={{...styles.button, backgroundColor: 'white'}}>
                                <Text style={{ ...styles.text, fontSize: 14, color: '#1e9bd4' }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity  style={{...styles.button, marginTop:10, backgroundColor: 'white'}}>
                            <Text style={{ ...styles.text, fontSize: 14, color: '#1e9bd4' }}>Friend Requests</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.divider}/>
            <View style={{padding:15}}>
                <Text style={styles.text}>{user.displayName}</Text>
                <Text style={{...styles.text, fontSize: 14, paddingTop: 10}}>{user.description}</Text>
            </View>
            <View style={styles.divider}/>            
            <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                {posts.length !== 0 ? (
                    <ScrollView contentContainerStyle={{ width: '95%', flexGrow: 1, alignItems: 'center'}}>
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
                ) : (
                    <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name="calendar" color={"white"} size={150}/>
                        <Text style={{...styles.text, fontSize: 20}}>No upcoming events</Text>
                    </View>
                    
                )}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
    },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'green'
    },
    input: {
        width: '100%', // Adjust width as needed
        height: 40,   // Set a fixed height or adjust as needed
        borderColor: '#00adb5',
        backgroundColor: 'white',
        color: 'grey',
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10
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
        paddingHorizontal: 22,
        borderRadius: 10,
        elevation: 1,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    text: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
    textNum: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    textFollow: {
        fontSize: 16,
        color: 'grey',
        fontFamily: 'Montserrat_400Regular'
    },
    profileImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '25%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 50,
        margin: 20
    },
    clubImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '40%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
       
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


export default ProfileScreen