import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";
import * as firebase from "firebase";

import foodReducer from "./store/reducers/food";
import authReducer from "./store/reducers/auth";
import NavigationContainer from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
	food: foodReducer,
	auth: authReducer,
});

const firebaseConfig = {
	apiKey: "AIzaSyCokHRdBoHmUb8bfqcRTk79GBrkpXj1r5k",
	authDomain: "expired-liao.firebaseapp.com",
	databaseURL: "https://expired-liao.firebaseio.com",
	projectId: "expired-liao",
	storageBucket: "expired-liao.appspot.com",
	messagingSenderId: "1098326579140",
	appId: "1:1098326579140:web:6300ea6e28bb7b1ef33691",
	measurementId: "G-GMT1M7HQSN"
  };

firebase.initializeApp(firebaseConfig);

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
	return Font.loadAsync({
		"open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
		"open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
	});
};

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => {
					setFontLoaded(true);
				}}
			/>
		);
	}

	return (
		<Provider store={store}>
			<NavigationContainer />
		</Provider>
	);
}
