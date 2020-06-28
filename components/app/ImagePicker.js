import Expo from 'expo';
import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, CameraRoll } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from "firebase";

//import Colors from '../constants/Colors';

const ImgPicker = props => {
    const [pickedImage, setPickedImage] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions', 
                'You need to grant camera permissions to use this app', 
                [{ text:'Okay' }]
            );
            return false;
        }
        return true;
    };

    uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("images/");
        return ref.put(blob);
    }

    // Opens Camera
    const takeImageHandler = async () => {
        const hasPermission = verifyPermissions();
        if (!hasPermission) {
            return;
        }
        
        let img = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1
        });

        if (!img.cancelled) {
            this.uploadImage(img.uri)
                .then(() => {
                    Alert.alert("Success");
                })
                .catch((error) => {
                    Alert.alert("Error!");
                });
        }

        console.log(img);
        setPickedImage(img.uri); 
    };
    

    return (
    <View style = {styles.imagePicker}>
        <View style = {styles.imagePreview}> 
            {!pickedImage ? (<Text> No image picked yet.</Text>)
            : (<Image style={styles.imagePreview} source ={{uri: pickedImage}}/>
            )}
            </View>
        <Button 
            title = "Take Img" 
            //color = {Colors.primary} 
            onPress={takeImageHandler}
        />
    </View>
    );
};


const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        margin: 15
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'#ccc',
        borderWidth: 1
    }
});

export default ImgPicker;