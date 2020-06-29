import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import { useDispatch } from 'react-redux';
import firebase from 'firebase';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth.js';

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // not sure where to put this listener...
    // this might not be the best place but seems to work fine
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('signed in:', user, user.uid);
        props.navigation.navigate('App');
      } else {
        console.log('not signed in');
        props.navigation.navigate('Auth');
      }
    });
  }, []);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupScreen;
