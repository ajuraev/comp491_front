import {View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity} from 'react-native'
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup/Signup';



function Welcome({setUser}){
    const [content, setContent] = useState('welcome')

    const Content = () =>{
        if(content === 'welcome'){
            return <ImageBackground
                        source={{uri: 'https://www.hse.ru/data/2021/01/29/1404113422/4e85321c55852563872ba13ec6f60c2.jpg'}} // Replace with the path to your image
                        style={styles.imageBackground}
                        blurRadius={3}
                    >
                        <View>
                            <Text style={styles.text}>Welcome to</Text>
                            <Text style={styles.textBold}>kucial</Text>
                        </View>
                        <View style={{
                            width: '80%',
                        }}>
                            <TouchableOpacity onPress={() => setContent('login')} style={styles.button}>
                                <Text style={{...styles.text, color: 'black'}}>Sign in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setContent('signup')} style={styles.button}>
                                <Text style={{...styles.text, color: 'black'}}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
        }else if (content === 'login'){
            return <Login setUser={setUser}/>
        }else{
            return <Signup setUser={setUser} setMainContent={setContent}/>
        }
    }

    return (
        <Content/>   
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      flex: 1, // This makes the image cover the entire view
      resizeMode: 'cover', // You can adjust the resizeMode as needed
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    text: {
      color: 'white',
      fontSize: 24,
      fontFamily: 'Montserrat_400Regular'
    },
    textBold: {
        color: 'white',
        fontSize: 34,
        fontFamily: 'Montserrat_700Bold'
      },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
  });


export default Welcome