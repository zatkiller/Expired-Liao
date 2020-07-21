import Expo from 'expo';
import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  Alert,
  CameraRoll,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';

const STORE_URL =
  'https://firebasestorage.googleapis.com/v0/b/expired-liao.appspot.com/o/';

const genImageUrl = (path) =>
  `${STORE_URL}${encodeURIComponent(path)}?alt=media`;

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    margin: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

const ImgPicker = ({ imageUrl, onImageTaken }) => {
  const [pickedImage, setPickedImage] = useState(imageUrl);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL,
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant camera permissions to use this app',
        [{ text: 'Okay' }],
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
  };

  // Opens Camera
  const takeImageHandler = async () => {
    const hasPermission = verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const img = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!img.cancelled) {
      const name = uuidv4();
      uploadImage(name, img.uri)
        .then((res) => {
          onImageTaken(genImageUrl(`images/${name}`));
          // Alert.alert('Your image has been uploaded!');
        })
        .catch((error) => {
          console.log('onImageTaken error:', error);
          Alert.alert('Image taken error!');
        });
    }

    setPickedImage(img.uri);
  };

  return (
    <TouchableOpacity onPress={takeImageHandler} style={styles.imagePreview}>
      {!pickedImage ? (
        <Text>Snap a Picture!</Text>
      ) : (
        <Image style={styles.imagePreview} source={{ uri: pickedImage }} />
      )}
    </TouchableOpacity>
  );
};

export default ImgPicker;
