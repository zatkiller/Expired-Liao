import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Permissions, Notifications, AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';
import * as firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';

import foodReducer from './store/reducers/food';
import authReducer from './store/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
	  shouldShowAlert: true,
	  shouldPlaySound: false,
	  shouldSetBadge: false,
	}),
  });

//Suppress yellow box warning caused by timer
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const rootReducer = combineReducers({
  food: foodReducer,
  auth: authReducer,
});

const firebaseConfig = {
  apiKey: 'AIzaSyCokHRdBoHmUb8bfqcRTk79GBrkpXj1r5k',
  authDomain: 'expired-liao.firebaseapp.com',
  databaseURL: 'https://expired-liao.firebaseio.com',
  projectId: 'expired-liao',
  storageBucket: 'expired-liao.appspot.com',
  messagingSenderId: '1098326579140',
  appId: '1:1098326579140:web:6300ea6e28bb7b1ef33691',
  measurementId: 'G-GMT1M7HQSN',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));



const sendPushNotification = async(expoPushToken) => {
	const message = {
	  to: expoPushToken,
	  sound: 'default',
	  title: 'Original Title',
	  body: 'And here is the body!',
	  data: { data: 'goes here' },
	};
  
	await fetch('https://exp.host/--/api/v2/push/send', {
	  method: 'POST',
	  headers: {
		Accept: 'application/json',
		'Accept-encoding': 'gzip, deflate',
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(message),
	});
  }

const registerForPushNotificationsAsync = async () => {
	let token;
	if (Constants.isDevice) {
	  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	  let finalStatus = existingStatus;
	  if (existingStatus !== 'granted') {
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	  }
	  if (finalStatus !== 'granted') {
		alert('Failed to get push token for push notification!');
		return;
	  }
	  token = (await Notifications.getExpoPushTokenAsync()).data;
	  console.log(token);
	} else {
	  alert('Must use physical device for Push Notifications');
	}
  
	if (Platform.OS === 'android') {
	  Notifications.setNotificationChannelAsync('default', {
		name: 'default',
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: '#FF231F7C',
	  });
	}
  
	return token;
};

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

        const localNotification = {
            title: 'done',
            body: 'done!'
        };

        const schedulingOptions = {
            time: (new Date()).getTime() + 10
        }

        // Notifications show only when app is not active.
        // (ie. another app being used or device's screen is locked)
        Notifications.scheduleLocalNotificationAsync(
            localNotification, schedulingOptions
        );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  
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
