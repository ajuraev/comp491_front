import { StyleSheet, Text, View, TextInput, TouchableOpacity,ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import api from '../api/axiosConfig'
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'expo-checkbox';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { format } from 'date-fns';

import * as ImagePicker from 'expo-image-picker';
import CameraScreen from './CameraScreen';
import { useSelector, useDispatch } from 'react-redux';

const { StatusBarManager } = NativeModules;



function CreateScreen() {
    const [title, onChangeTitle] = useState('');
    const [description, onChangeDescription] = useState('');
    const [location, onChangeLocation] = useState('');
    const [price, onChangePrice] = useState(-1);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chosenDate, setChosenDate] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxAttendees, setMaxAttendees] = useState(-1);
    const navigation = useNavigation();

    const userData = useSelector(state => state.user.userData);


    const [startCamera,setStartCamera] = useState(false)

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
     if(status === 'granted'){
       setStartCamera(true)
     }else{
       Alert.alert("Access denied")
     }
    }

    const cancelPost = () => {
      
      onChangeTitle("");
      onChangeDescription("");
      onChangeLocation("");
      onChangePrice("");
      setMaxAttendees("");
      setImage(null);
      setChosenDate(null);
      

      navigation.navigate('Home');

    }
    const postEvent = () => {
      const formData = new FormData();
      formData.append('eventImg', image)
      formData.append('eventTitle', title);
      formData.append('eventDescription', description);
      formData.append('location', location);
      formData.append('maxPeople', maxAttendees);
      formData.append('isPublic', !isPrivate);
      formData.append('price', price);
      formData.append('eventDate', chosenDate.toISOString().replace(/\.\d+/, ''));
      formData.append('token', userData.token);
      navigation.navigate('Home');

      console.log(formData)

      api.post(`/Event`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
          console.log(response.data);
          cancelPost();

      })
      .catch(error => {
          if(error.response.data.message === 'No file uploaded.'){
          }
          console.log(error.response.data.message);
      });
    }

    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setChosenDate(selectedDate);
      }
    };

    const handleTimeChange = (event, selectedTime) => {
      setShowTimePicker(false);
      if (selectedTime) {
        setChosenDate((prevDate) => {
          // Update only the time part of the date
          return new Date(
            prevDate.getFullYear(),
            prevDate.getMonth(),
            prevDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
          );
        });
      }
    };

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
                    <TouchableOpacity onPress={cancelPost}>
                      <Text style={{
                        fontSize: 16,
                        color: '#00adb5',
                        fontFamily: 'Montserrat_400Regular'
                      }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>CREATE EVENT</Text>
                    <TouchableOpacity onPress={postEvent}>
                      <Text style={{
                        fontSize: 16,
                        color: '#00adb5',
                        fontFamily: 'Montserrat_400Regular'
                        }}>
                        Publish
                      </Text>
                    </TouchableOpacity>
                  </View>                  
                  <View style={{width: '90%'}}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    placeholder="Title"
                    value={title}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeDescription}
                    placeholder="Description"
                    multiline={true} 
                    value={description}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeLocation}
                    placeholder="Location"

                    value={location}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangePrice}
                    placeholder="Price"
                    value={price}
                  />
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>
                      {chosenDate === null ? 'Pick Date' : format(chosenDate, 'MM/dd/yyyy')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setShowTimePicker(true)}>
                    <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>
                      {chosenDate === null ? 'Pick Time' : format(chosenDate, 'hh:mm a')}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      mode="date"
                      value={chosenDate || new Date()}
                      onChange={handleDateChange}
                    />
                  )}
                  {showTimePicker && (
                    <DateTimePicker
                      mode="time"
                      value={chosenDate || new Date()}
                      onChange={handleTimeChange}
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Max Attendees"
                    keyboardType="numeric"
                    value={maxAttendees === -1 ? '' : maxAttendees.toString()}
                    onChangeText={(text) => {
                      if (text.toLowerCase() === '') {
                        setMaxAttendees(-1);
                      } else {
                        setMaxAttendees(parseInt(text, 10) || 0);
                      }
                    }}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <CheckBox value={isPrivate} onValueChange={() => setIsPrivate(!isPrivate)} />
                    <Text style={{ ...styles.text, fontSize: 14, color: 'white', marginLeft: 10 }}>Make Private</Text>
                  </View>
                  </View>
                  {image && <Image source={{ uri: image }} style={{aspectRatio: 1, width: '75%', margin: 20, borderRadius: 10}} />}
                  <TouchableOpacity onPress={pickImage} style={styles.button}>
                    <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>Pick image</Text>
                  </TouchableOpacity>
            </View>
            )}

      </KeyboardAvoidingView>
    );
  }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
    },
    camera: {
        flex: 1,
      },
    input: {
        width: '100%', // Adjust width as needed
        height: 40,   // Set a fixed height or adjust as needed
        borderColor: '#00adb5',
        backgroundColor: 'white',
        fontFamily: 'Montserrat_400Regular',
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
        backgroundColor: '#1e9bd4',
        marginTop: 10
    },
    text: {
        fontSize: 16,
        color: '#00adb5',
        fontFamily: 'Montserrat_400Regular'
      },
    postImage: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '85%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
    }
    });
export default CreateScreen