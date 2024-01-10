import {View, Text, ImageBackground, Image, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig'

function Login({setUser}){
    const [email, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');


    const handleSubmit = () => {
        const loginData = {
            email: email, // Replace with the actual email
            password: password,  // Replace with the actual password
        };
          
        var token;

        api.post('/Event/AppLogin', loginData)
        .then((response) => {
            // Handle the successful response here
            console.log('Login Successful:', response.data);
            token = response.data.message
            api.get('/Event/loggedUser', {
                params: {
                  token: response.data.message,
                },
            })
            .then((response) => {
                console.log('Data:', response.data);
                setUser({...response.data, token: token})
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Login Error:', error);
        });
    }
    

    return (
            <ImageBackground
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
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeUsername}
                        value={email}
                        placeholder='Email'
                        autoCapitalize='none'

                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangePassword}
                        value={password}
                        placeholder='Password'
                        secureTextEntry={true}
                    />
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                        <Text style={{...styles.text, color: 'black'}}>Sign in</Text>
                    </TouchableOpacity>
                </View> 
            </ImageBackground>
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
    input: {
        width: '100%', // Adjust width as needed
        height: 45,   // Set a fixed height or adjust as needed
        backgroundColor: 'white',
        color: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10,
        fontFamily: 'Montserrat_400Regular'
    },
  });


export default Login