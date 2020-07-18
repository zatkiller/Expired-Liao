import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        var uid = await firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).set({
          email: email,
          userId: uid,
        });
      })
      .catch(function (error) {
        console.log('fail lah bro');
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('signup error:', errorCode, errorMessage);
      });
  };
};

export const login = (email, password) => {
  console.log('login:', email, 'password:', password);
  return async (dispatch) => {
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.log('login error:', err);
    }
  };
};

export const logout = () => {
  // AsyncStorage.removeItem("userData");
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log('logout success');
    })
    .catch(function (err) {
      console.log('logout error:', err);
    });
  return { type: LOGOUT };
};

/*
const saveDataToStorage = (token, userId) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
    }),
  );
};
*/
