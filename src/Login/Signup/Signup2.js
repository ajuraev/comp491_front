import { View, Text, TouchableOpacity,Image, TextInput,StyleSheet, NativeModules } from "react-native"
const { StatusBarManager } = NativeModules;
import Checkbox from 'expo-checkbox';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

function Signup2({setContent, setUserInfo, setUserImage}){
    const [isChecked, setChecked] = useState(false);
    const [info, setInfo] = useState({});
    const [image, setImage] = useState(null);

    

    const handleSubmit = () => {
       
        if (!info.displayName || !info.username || !info.email || !info.password) {
        
        } else {
            if (info.email.endsWith("@ku.edu.tr")) {
              setUserInfo({ ...info });
              setUserImage(image);
              setContent('3');
            } else {
              console.error('Invalid email domain. Must end with "@ku.edu.tr"');
            }
          }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled) {
          // Get the URI of the selected image
          const imageUri = result.assets[0].uri;
  
          setImage(imageUri)
          // Download the image data from the URI
          const response = await fetch(imageUri);
          const imageBuffer = await response.arrayBuffer();
  
          setImage({
            name: 'image.jpg', // Name of the file to be sent
            type: 'image/jpeg', // MIME type of the file
            uri: imageUri,
            data: imageBuffer, // The image data as a buffer
          })

        }
      };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.buttonContainer}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput
                    style={styles.input}
                    autoCapitalize='none'

                    placeholder='Display name'
                    onChangeText={(text) => setInfo({ ...info, displayName: text })}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder='@Username'
                    autoCapitalize='none'

                    onChangeText={(text) => setInfo({ ...info, username: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'

                    onChangeText={(text) => setInfo({ ...info, email: text })}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setInfo({ ...info, password: text })}
                    secureTextEntry
                    autoCapitalize='none'

                    placeholder='Password'
                />
                {image && <Image source={{ uri: image }} style={{aspectRatio: 1, width: '75%', margin: 20, borderRadius: 10}} />}
                  <TouchableOpacity onPress={pickImage} style={styles.buttonPic}>
                    <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>Pick image</Text>
                  </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#4630EB' : undefined}
                    />
                    <Text style={styles.checkBoxText}>I agree with Terms & Conditions</Text>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222831',
      alignItems: 'center',
    },
    buttonContainer: {
        width: '80%'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
        marginTop: '20%',
        marginBottom: '10%'
    },
    checkBoxText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
    },
    buttonText: {
        color: '#2e4374',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
    },
    input: {
        width: '100%', // Adjust width as needed
        height: 50,   // Set a fixed height or adjust as needed
        backgroundColor: 'white',
        color: '#2e4374',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginVertical: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonPic: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#1e9bd4',
        marginTop: 10
    },
    checkbox: {
        marginVertical: 8,
        marginRight: 8,
        height: 30,
        width: 30,
        borderRadius: 5
      },
  });
export default Signup2