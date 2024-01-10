import { View, Text, StyleSheet, NativeModules, TouchableOpacity } from "react-native"
const { StatusBarManager } = NativeModules;

function FavoriteScreen(){

    return(
        <View style={styles.container}> 
            <View style={{width: '90%', paddingTop: 25}}>
                <Text style={styles.title}>Favorites</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={null}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00adb5',
                            fontFamily: 'Montserrat_400Regular',
                            paddingRight: 15
                            }}>
                            Events
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={null}>
                        <Text style={{
                            fontSize: 16,
                            color: '#00adb5',
                            fontFamily: 'Montserrat_400Regular'
                            }}>
                            Clubs
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
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