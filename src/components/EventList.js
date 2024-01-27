import { StyleSheet, Text, View, TextInput,Animated, TouchableOpacity, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { formatTime, formatDate } from '../utils/dateHelpers'; 

function EventList ({navigation, posts}){

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          {posts.map((post, index) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('EventInfo', { post: post})} 
              key={index} style={{width: '95%', margin: 10, padding: 10,  borderRadius: 10 }}>
              <View style={{ flex: 1}}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <View style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }} />
                <View style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', left: '5%', top: '5%', backgroundColor: 'white', padding:10,borderRadius: 50, elevation: 20}}>
                    <Ionicons name="person-outline" color={'black'} size={14} />
                    <Text style={styles.participantCount}> {post.users_joining.length}</Text>
                  </View>
                <View  style={styles.postInfoContainer}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
                    <Text style={styles.postOwner}>{post.ownerId}</Text>
                    <Text style={{...styles.postOwner, color: 'grey'}}>{formatDate(post.event_date)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
    )
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
        color: '#ab162b',
        padding: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    postTitle: {
      fontSize: 16,
      color: 'black',
      fontFamily: 'Montserrat_400Regular',
      paddingVertical: 10,
      paddingHorizontal: 16
    },
    postOwner: {
      fontSize: 12,
      color: 'black',
      fontFamily: 'Montserrat_400Regular',
      paddingHorizontal: 16,
      paddingBottom: 10
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
      fontSize: 16,
      color: 'black',
      fontFamily: 'Montserrat_400Regular'
    },
    postImage: {
        aspectRatio: 4/3, // 1:1 aspect ratio (square)
        width: '100%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 15,
    },
    postInfoContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      borderRadius: 10,
      width: '90%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      elevation: 20
    }
    });
export default EventList