import { AsyncStorage } from "react-native";
import firebase from 'firebase';

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (userId, token) => {
	return (dispatch) => {
		dispatch({ type: AUTHENTICATE, userId: userId, token: token });
	};
};

export const signup = (email, password) => {
	return async (dispatch) => {
		// const response = await fetch(
		// 	"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCokHRdBoHmUb8bfqcRTk79GBrkpXj1r5k",
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			email: email,
		// 			password: password,
		// 			returnSecureToken: true,
		// 		}),
		// 	}
		// );

		// if (!response.ok) {
		// 	const errorResData = await response.json();
		// 	const errorId = errorResData.error.message;
		// 	let message = "Something went wrong!";
		// 	if (errorId === "EMAIL_EXISTS") {
		// 		message = "This email exists already!";
		// 	}
		// 	throw new Error(message);
		// }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(user) {
                console.log(user);
            })
            .catch(function(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

		// const resData = await response.json();
		// console.log(resData);
		// dispatch(authenticate(resData.localId, resData.idToken));
		// saveDataToStorage(resData.idToken, resData.localId);
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		// const response = await fetch(
		// 	"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCokHRdBoHmUb8bfqcRTk79GBrkpXj1r5k",
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			email: email,
		// 			password: password,
		// 			returnSecureToken: true,
		// 		}),
		// 	}
		// );

		// if (!response.ok) {
		// 	const errorResData = await response.json();
		// 	const errorId = errorResData.error.message;
		// 	let message = "Something went wrong!";
		// 	if (errorId === "EMAIL_NOT_FOUND") {
		// 		message = "This email could not be found!";
		// 	} else if (errorId === "INVALID_PASSWORD") {
		// 		message = "This password is not valid!";
		// 	}
		// 	throw new Error(message);
		// }
        

        email = 'nig@ger.com';
        password = '123123';

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
                return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .then(function(user) {
                console.log(user);
            })
            .catch(function(err){
                console.log('login error:', err.code, err.message);
            });

		// const resData = await response.json();

		// dispatch(authenticate(resData.localId, resData.idToken));
		// dispatch(authenticate(resData.localId, resData.idToken));
		// saveDataToStorage(resData.idToken, resData.localId);
	};
};

export const logout = () => {
	// AsyncStorage.removeItem("userData");
    firebase.auth().signOut().then(function() {
        console.log('logout success');
    }).catch(function(err){
        console.log('logout error:', err);
    });
	return { type: LOGOUT };
};

const saveDataToStorage = (token, userId) => {
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token: token,
			userId: userId,
		})
	);
};
