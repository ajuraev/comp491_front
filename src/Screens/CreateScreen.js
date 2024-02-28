import { StyleSheet, Text, View, TextInput, Alert, Modal, TouchableOpacity,ImageBackground, SafeAreaView, Platform, NativeModules, ActivityIndicator, Button, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import api from '../api/axiosConfig'
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'expo-checkbox';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { format } from 'date-fns';
import Tags from "react-native-tags";

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import CameraScreen from './CameraScreen';
import { useSelector, useDispatch } from 'react-redux';
import MultiSelect from 'react-native-multiple-select';


const { StatusBarManager } = NativeModules;

const categoriesList = [{
  id: '1',
  name: 'Music'
}, {
  id: '2',
  name: 'Academic'
}, {
  id: '3',
  name: 'Art'
}, {
  id: '4',
  name: 'Dance'
}, {
  id: '5',
  name: 'Football'
}, {
  id: '6',
  name: 'Basketball'
}, {
  id: '7',
  name: 'Tennis'
}
];

function CreateScreen() {
    const [title, onChangeTitle] = useState('');
    const [description, onChangeDescription] = useState('');
    const [location, onChangeLocation] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [price, onChangePrice] = useState(-1);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chosenDate, setChosenDate] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxAttendees, setMaxAttendees] = useState(-1);
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [postStatus, setPostStatus] = useState(-1) //0 success, 1 error

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
      setSelectedCategories([])
      

      navigation.navigate('Home');

    }


    const isValidForm = () => {
      console.log(selectedCategories)
      // Check if all the required fields are filled
      if (!title || !description || !location || price === -1 || maxAttendees === -1 || !chosenDate || !image || selectedCategories.length == 0) {
          // One or more fields are empty or have invalid values
          // Optionally show an alert or set an error state here
          Alert.alert('','Please fill all the fields.',[
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {
            cancelable: true,
          });
          //alert("Please fill all the fields.");
          return false;
      }

      return true;
    };

    const handleSelectTag = (tag) => {
      setSelectedTags(prevSelectedTags => {
        if (prevSelectedTags.includes(tag)) {
          // Remove the tag if it is already selected
          return prevSelectedTags.filter(t => t !== tag);
        } else {
          // Add the tag if it is not selected
          return [...prevSelectedTags, tag];
        }
      });
    };
    const postEvent = () => {


      if (!isValidForm()) return;

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

      const selectedCategoryNames = selectedCategories.map(categoryId => {
        const selectedCategory = categoriesList.find(category => category.id === categoryId);
        return selectedCategory ? selectedCategory.name : ''; // Use an empty string if not found
      });

      selectedCategoryNames.forEach((categoryName, index) => {
        formData.append(`categories[${index}]`, categoryName);
      });
      //formData.append('categories', selectedCategoryNames);

      //console.log(selectedCategoryNames)
      console.log(formData)

      setIsLoading(true); // Start loading
      setPostStatus(-1)



      api.post(`/Event`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
          console.log(response.data);
          setPostStatus(0)

          setTimeout(() => {
            cancelPost();
          }, 1000);
      })
      .catch(error => {
          if(error.response.data.message === 'No file uploaded.'){
          }
          setPostStatus(1)
          console.log(error.response.data.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          setPostStatus(-1)
        }, 1000);
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
      if (selectedTime && chosenDate) {
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
        aspect: [4, 3],
        quality: 1,
      });

      //console.log(result);

      if (!result.canceled) {
        // Compress the selected image
        const compressedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [], // No transformations
          { compress: 0.25, format: ImageManipulator.SaveFormat.JPEG } // Adjust compression here
        );
    
        // Get the URI of the compressed image
        const imageUri = compressedImage.uri;
    
        // Download the image data from the URI if necessary
        const response = await fetch(imageUri);
        const imageBuffer = await response.arrayBuffer();
    
        setImage({
          name: 'image.jpg', // Name of the file to be sent
          type: 'image/jpeg', // MIME type of the file
          uri: imageUri,
          data: imageBuffer, // The image data as a buffer
        });
      }
    };

    

    return (
      <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust as needed
      >
          <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
          >
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                {postStatus == 1 ? (
                    <Text style={{ ...styles.text, fontSize: 20, color: 'white'}}>Could not post :(</Text>
                      ) : (
                  postStatus == 0 ? (
                    <Text style={{ ...styles.text, fontSize: 20, color: 'white'}}>Event posted :)</Text>
                    ) : (
                    <ActivityIndicator size="large" color="#ab162b" />
                  )
                )}
              </View>
            </View>
          </Modal>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            {startCamera ? (
                <CameraScreen setImage={setImage} setStartCamera={setStartCamera}/>
            ) : (
                <View style={{ flex: 1, alignItems: 'center'}}>
                  <View style={{width: '90%',flexDirection: 'row',     padding: -10, // Ensure padding is set to 0 here
            alignItems:'center',justifyContent: 'space-between', paddingVertical: 10}}>
                    <TouchableOpacity onPress={cancelPost}>
                      <Ionicons  name="close-outline" color={"white"} size={40} />
                    </TouchableOpacity>
                    <Text style={styles.title}>POST EVENT</Text>
                    <TouchableOpacity onPress={postEvent}>
                      <Ionicons name="checkmark-outline" color={"white"} size={40} />
                    </TouchableOpacity>
                  </View>                  
                  <View style={{width: '90%'}}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    placeholder="Title"
                    value={title}
                    placeholderTextColor='grey'
                  />
                  <TouchableOpacity onPress={pickImage} style={styles.imgContainer}>
                    {image ? <Image source={{ uri: image.uri }} style={styles.img}/> :(
                    <View style={styles.placeholderImg}>
                      <Ionicons name="add-circle-outline" color={"white"} size={50} />
                    </View> 
                    )}
                  </TouchableOpacity>
                  <MultiSelect
                    items={categoriesList}
                    uniqueKey="id"
                    onSelectedItemsChange={setSelectedCategories}
                    selectedItems={selectedCategories}
                    selectText="Pick Categories"
                    searchInputPlaceholderText="Search Categories..."
                    tagRemoveIconColor="white"
                    tagBorderColor="white"
                    tagTextColor="white"
                    selectedItemTextColor="white"
                    selectedItemIconColor="white"
                    selectedItemFontFamily="Montserrat_400Regular"	
                    altFontFamily="Montserrat_400Regular"
                    itemTextColor="grey"
                    itemFontFamily='Montserrat_400Regular'
                    itemFontSize={14}
                    displayKey="name"
                    hideSubmitButton
                    hideDropdown
                    styleMainWrapper={styles.multiSelectWrapper}  // Custom wrapper styles
                    styleDropdownMenuSubsection={styles.dropdownMenuSubsection}  // Custom dropdown menu styles
                    styleDropdownMenu={styles.dropdownMenu}  // Custom style for the dropdown menu
                    styleInputGroup={styles.inputGroup}  // Custom input group styles
                    styleSelectorContainer={styles.selectorContainer}  // Custom selector container styles
                    styleTextDropdown={styles.textDropdown}  // Custom text dropdown styles
                    styleItemsContainer={styles.itemsContainer}  // Custom text dropdown styles
                    styleTextDropdownSelected={styles.textDropdownSelected}  // Custom style for selected dropdown text
                    styleTextTag={styles.textTag}  // Custom style for tags
                    textInputProps={{
                      style: { fontFamily: 'Montserrat_400Regular', color: 'white', flex:1, justifyContent: 'space-between'}, // Set the font family for the input
                    }}
                  />
                  <TextInput
                    style={{...styles.input, height: 100,
                    textAlignVertical: 'top'}}
                    onChangeText={onChangeDescription}
                    placeholder="Description"
                    multiline={true} 
                    numberOfLines={4}
                    maxLength={196}
                    value={description}
                    placeholderTextColor='grey'
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeLocation}
                    placeholder="Location"
                    placeholderTextColor='grey'
                    value={location}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangePrice}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={price === -1 ? '' : price.toString()}
                    placeholderTextColor='grey'
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Max Attendees"
                    keyboardType="numeric"
                    placeholderTextColor='grey'
                    value={maxAttendees === -1 ? '' : maxAttendees.toString()}
                    onChangeText={(text) => {
                      if (text.toLowerCase() === '') {
                        setMaxAttendees(-1);
                      } else {
                        setMaxAttendees(parseInt(text, 10) || 0);
                      }
                    }}
                  />
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity 
                      style={styles.dateInput}
                      placeholderTextColor='grey'
                      onPress={() => setShowDatePicker(true)}>
                      <Text style={{ ...styles.text, fontSize: 14, color: chosenDate ? 'white' : 'grey' }}>
                        {chosenDate === null ? 'Date' : format(chosenDate, 'EEEE, MMM do')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.timeInput}
                      onPress={() => setShowTimePicker(true)}>
                      <Text style={{ ...styles.text, fontSize: 14, color: chosenDate ? 'white' : 'grey' }}>
                        {chosenDate === null ? 'hh:mm' : format(chosenDate, 'hh:mm a')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <CheckBox 
                        style={{width: 24, aspectRatio: 1}}
                        color={isPrivate ? '#ab162b' : undefined}
                        value={isPrivate} onValueChange={() => setIsPrivate(!isPrivate)} />
                      <Text style={{ ...styles.text, fontSize: 14, color: 'white', marginLeft: 10 }}>Make Private</Text>
                    </View>
                  </View>
                  
                  
                
            </View>
            )}
        </ScrollView>
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
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: 'rgba(0,0,0,0.8)' // semi-transparent background
    },
    activityIndicatorWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    input: {
      height: 40,
      width: '100%',
      color: 'white',
      marginVertical: 5,
      borderWidth: 1, 
      borderColor: 'white',
      borderRadius: 10,
      fontFamily: 'Montserrat_400Regular',
      fontSize: 14,
      padding: 10
    },
    dateInput: {
      height: 40,
      minWidth: '40%',
      color: 'white',
      marginVertical: 5,
      borderWidth: 1, 
      borderColor: 'white',
      borderRadius: 10,
      fontFamily: 'Montserrat_400Regular',
      fontSize: 14,
      padding: 10
  },
  timeInput: {
    height: 40,
    color: 'white',
    marginVertical: 5,
    borderWidth: 1, 
    borderColor: 'white',
    borderRadius: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    padding: 10
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
    title: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    text: {
      fontSize: 12,
      color: 'white',
      fontFamily: 'Montserrat_400Regular'
  },
    imgContainer: {
      width: '100%',
      borderColor: 'white',
      marginVertical: 5,
    },
    img: {
      width: '100%',
      aspectRatio: 4/3, 
      borderRadius: 10
    },
    placeholderImg: {  
      aspectRatio: 4/3,
      width: '100%',  
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems:'center' 
    },
    multiSelectWrapper: {
      borderWidth: 1,
      marginVertical: 5
    },
    dropdownMenuSubsection: {
      borderColor: 'white',  // Border color for the dropdown menu subsection
      borderWidth: 1,  // Border width for the dropdown menu subsection,
      borderRadius: 10,
      backgroundColor: 'black',
      height:50,
    },
    inputGroup: {
      borderColor: 'white',  // Border color for the input group
      borderWidth: 1,  // Border width for the input group
      backgroundColor: 'black',
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,


    },
    selectorContainer: {

    },
    textDropdownSelected: {
      color: 'white',  // Set the text color for selected dropdown item
      fontSize: 14,    // Set the font size for selected dropdown item
      fontFamily: 'Montserrat_400Regular',
      marginLeft: 10
    },
    textDropdown: {
      color: 'white',  // Set the text color for dropdown items
      fontSize: 14,    // Set the font size for dropdown items
      fontFamily: 'Montserrat_400Regular',
      marginLeft: 10

    },
    textTag: {
      color: 'white',  // Set the text color for tags
      fontSize: 14,    // Set the font size for tags
      fontFamily: 'Montserrat_400Regular',
      
    },
    dropdownMenu: {
      backgroundColor: 'black',
    },
    itemsContainer: {
      borderWidth: 1,
      borderTopWidth: 0,
      backgroundColor: 'black',
      borderColor: 'white',

    },
    });
export default CreateScreen