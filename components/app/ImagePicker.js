import Expo from 'expo';
import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, CameraRoll } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from "firebase";
import { v4 as uuidv4 } from 'uuid';

//import Colors from '../constants/Colors';

const STORE_URL = 'https://firebasestorage.googleapis.com/v0/b/expired-liao.appspot.com/o/'

const genImageUrl = (path) => `${STORE_URL}${encodeURIComponent(path)}?alt=media`;

const ImgPicker = props => {
    const [pickedImage, setPickedImage] = useState(props.imageUrl);

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

    const uploadImage = async (name, uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child(`images/${name}`);
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
            const name = uuidv4();
            uploadImage(name, img.uri)
                .then((res) => {
                    //console.log("Success", name, img, res);
                    Alert.alert("Success");
                    props.onImageTaken(genImageUrl(`images/${name}`));
                })
                .catch((error) => {
                    //console.log("Error", error);
                    Alert.alert("Error!");
                });
        }

        //console.log(img);
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
