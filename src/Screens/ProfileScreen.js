import { View, Text, StyleSheet, Platform, TouchableOpacity, Image,NativeModules } from "react-native"
import { Ionicons } from '@expo/vector-icons';
const { StatusBarManager } = NativeModules;


function ProfileScreen({user}){
    return(
        <View style={styles.container}>
            <View style={styles.container1}>
                <TouchableOpacity  style={styles.iconButton}>
                    <Ionicons name="arrow-back-outline" color={"white"} size={25} />
                </TouchableOpacity>
                <Text style={styles.text}>@{user.username}</Text>
                <TouchableOpacity  style={styles.iconButton}>
                    <Ionicons name="create-outline" color={"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container2}>
                <Image source={{uri: user.profileImageUrl}} style={styles.profileImg}/>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={styles.textNum}>0</Text>
                        <Text style={styles.textFollow}>followers</Text>
                        <TouchableOpacity  style={{...styles.button, backgroundColor: '#1e9bd4'}}>
                            <Text style={{ ...styles.text, fontSize: 14}}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.textNum}>0</Text>
                        <Text style={styles.textFollow}>following</Text>
                        <TouchableOpacity  style={{...styles.button, backgroundColor: 'white'}}>
                            <Text style={{ ...styles.text, fontSize: 14, color: '#1e9bd4' }}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.divider}/>
            <View style={{padding:15}}>
                <Text style={styles.text}>{user.displayName}</Text>
                <Text style={{...styles.text, fontSize: 14, paddingTop: 10}}>{user.description}</Text>
            </View>
            <View style={styles.divider}/>            
            <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                <Ionicons name="calendar" color={"white"} size={150}/>
                <Text style={{...styles.text, fontSize: 20}}>No upcoming events</Text>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
    },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center'
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
        margin: 10,
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
        borderRadius: 10,
        margin: 20
    },
    clubImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '40%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
       
    }
});


export default ProfileScreen