import { StyleSheet, Text, View, TextInput, TouchableOpacity,ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import api from '../api/axiosConfig'


import * as ImagePicker from 'expo-image-picker';
import CameraScreen from './CameraScreen';

const { StatusBarManager } = NativeModules;



function CreateScreen() {
    const [title, onChangeTitle] = useState('Title');
    const [description, onChangeDescription] = useState('Description');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const [startCamera,setStartCamera] = useState(false)

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
     if(status === 'granted'){
       // do something
       setStartCamera(true)
     }else{
       Alert.alert("Access denied")
     }
    }



      
    
    const postEvent = () => {
      const formData = new FormData();
      formData.append('eventImg', selectedFile)
      formData.append('eventTitle', 'Your Title Here');
      formData.append('eventDescription', 'Your Description Here');
      console.log(formData)
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    
      api.post(`/event`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
          console.log(response.data);
      })
      .catch(error => {
          if(error.response.data.message === 'No file uploaded.'){
          }
          console.log(error.response.data.message);
      });
    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    
      //console.log(result);
    
      if (!result.canceled) {
        // Get the URI of the selected image
        const imageUri = result.assets[0].uri;
        
        setImage(imageUri)
        // Download the image data from the URI
        const response = await fetch(imageUri);
        const imageBuffer = await response.arrayBuffer();
    
        // Now you have the image data as a buffer, which you can include in your FormData
        // const formData = new FormData();
        // formData.append('file', {
        //   name: 'image.jpg', // Name of the file to be sent
        //   type: 'image/jpeg', // MIME type of the file
        //   uri: imageUri,
        //   data: imageBuffer, // The image data as a buffer
        // });
        setImage({
          name: 'image.jpg', // Name of the file to be sent
          type: 'image/jpeg', // MIME type of the file
          uri: imageUri,
          data: imageBuffer, // The image data as a buffer
        })
        // formData.append('title', 'Your Title Here');
        // formData.append('description', 'Your Description Here');
    
        // Now you can send the FormData in your POST request as shown in the previous examples.
      }
    };
    
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            {startCamera ? (
                <CameraScreen setImage={setImage} setStartCamera={setStartCamera}/>
            ) : (
                <View style={{ flex: 1, alignItems: 'center'}}>
                  <View style={{width: '90%',flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10}}>
                    <TouchableOpacity>
                      <Text style={{
                        fontSize: 16,
                        color: '#00adb5',
                        fontFamily: 'HK Grotesk'
                      }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>CREATE</Text>
                    <TouchableOpacity onPress={postEvent}>
                      <Text style={{
                        fontSize: 16,
                        color: '#00adb5',
                        fontFamily: 'HK Grotesk'
                        }}>
                        Publish
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '90%',flexDirection: 'row', paddingVertical: 10}}>
                    <TouchableOpacity style={{
                      borderWidth: 2,
                      borderColor: '#00adb5',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                      borderRadius: 5,
                      marginRight: 10
                    }}>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: 'HK Grotesk',
                        }}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      borderWidth: 2,
                      borderColor: '#00adb5',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                      borderRadius: 5
                    }}>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: 'HK Grotesk'
                        }}>Event</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '90%'}}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    value={title}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeDescription}
                    value={description}
                  />
                  </View>
                  
                  {image && <Image source={{ uri: image }} style={{aspectRatio: 1, width: '80%'}} />}
                  <input type="file" onChange={handleFileChange} />
                  <Button title="Take a photo" onPress={__startCamera} /> 

            </View>
            )}
            
      </KeyboardAvoidingView>
    );
  }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
    },
    camera: {
        flex: 1,
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
        color: '#00adb5',
        fontFamily: 'HK Grotesk'
      },
    postImage: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '85%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
    }
    });
export default CreateScreen