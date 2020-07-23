import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import moment from 'moment';

import Food from '../../models/Food';

export const DELETE_FOOD = 'DELETE_FOOD';
export const CREATE_FOOD = 'CREATE_FOOD';
export const UPDATE_FOOD = 'UPDATE_FOOD';
export const SET_FOOD = 'SET_FOOD';

const LOCAL_STORE_PREFIX = '@ExpiredLiao:';

const userNotifData = {};

// helper function to set value in asyncstorage
const asyncStoreSet = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${LOCAL_STORE_PREFIX}:${key}`, value);
  } catch (e) {
    console.log('asyncStoreSet error', e);
  }
};

// helper function to get something from the asyncstorage
const asyncStoreGet = async (key) => {
  try {
    const value = await AsyncStorage.getItem(`${LOCAL_STORE_PREFIX}:${key}`);
    return value || '{}';
  } catch (e) {
    console.log('asyncStoreGet error', e);
    return '{}';
  }
};

const STORE_KEY = 'userNotifData';

// helper function to schedule notif and return notif id
const scheduleNotif = async (userEmail, food) => {
  // const notifId = await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: `${userEmail}: expiry warning!`,
  //     body: `${food.title} is expiring in 3 days on ${food.date}`,
  //   },
  //   trigger: {
  //     seconds: 100,
  //   },
  // });

  return 5;
};

// helper function for initial set up of push notifications
const setUpNotifs = async (userId, userEmail, loadedFood) => {
  // set up push notifications only if we're on a physical android/ios
  if (!Constants.isDevice || Constants.platform.web) return;

  console.log('setUpNotifs', moment().format('DD-MM-YYYY'));

  const userNotifData = JSON.parse(await asyncStoreGet(STORE_KEY));

  // cancel all pending notifications for user with uid
  if (userNotifData[userId] && userNotifData[userId].notifs) {
    userNotifData[userId].notifs.forEach(({ notifId }) => {
      Notifications.cancelScheduledNotificationAsync(notifId);
    });
  }

  userNotifData[userId] = {
    notifs: [],
  };

  // schedule notifications for all user uid's foods and
  // store their notifIds in userNotifData[uid].notifs
  loadedFood.forEach(async (food) => {
    userNotifData[userId].notifs.push({
      foodId: food.id,
      notifId: await scheduleNotif(userEmail, food),
    });
  });

  // update local async storage the new list of pending notifs for user
  await asyncStoreSet(STORE_KEY, JSON.stringify(userNotifData));
  console.log(userNotifData);
  console.log('done setting up notifications');
};

const removeNotif = async (userId, userEmail, foodId) => {
  // set up push notifications only if we're on a physical android/ios
  if (!Constants.isDevice || Constants.platform.web) return;

  const userNotifData = JSON.parse(await asyncStoreGet(STORE_KEY));
  const tempNotifs = [];

  // add only to tempNotifs notifs which aren't the one we wanna remove
  // and cancel the removed food's notif
  console.log(foodId);
  console.log(userNotifData);
  userNotifData[userId].notifs.forEach((notif) => {
    if (notif.foodId === foodId) {
      console.log('cancelled', notif.notifId);
      Notifications.cancelScheduledNotificationAsync(notif.notifId);
    } else {
      tempNotifs.push(notif);
    }
  });
  userNotifData[userId].notifs = tempNotifs;

  asyncStoreSet(STORE_KEY, JSON.stringify(userNotifData));
};

const addOrUpdateNotif = async (userId, userEmail, food) => {
  // set up push notifications only if we're on a physical android/ios
  if (!Constants.isDevice || Constants.platform.web) return;

  const userNotifData = JSON.parse(await asyncStoreGet(STORE_KEY));

  const tempNotifs = [];
  const { foodId } = food;

  // append notifs to keep to tempNotifs
  // cancel the notif which is the one we're updating
  // it shouldn't affect anything else
  userNotifData[userId].notifs.forEach((notif) => {
    if (notif.foodId === foodId) {
      Notifications.cancelScheduledNotificationAsync(notif.notifId);
    } else {
      tempNotifs.push(notif);
    }
  });

  // schedule notif of new food or newly updated food and add to tempNotifs
  tempNotifs.push({ foodId, notifId: await scheduleNotif(userEmail, food) });
  userNotifData[userId].notifs = tempNotifs;
  asyncStoreSet(STORE_KEY, JSON.stringify(userNotifData));
};

export const fetchFood = () => async (dispatch, getState) => {
  try {
    const { uid: userId, email: userEmail } = firebase.auth().currentUser;

    const response =
      (
        await firebase
          .database()
          .ref('food')
          .orderByChild('ownerId')
          .equalTo(userId) // query only for results where ownerId==uid
          .once('value')
      ).val() || {};

    const loadedFood = Object.keys(response).map((foodId) => {
      const food = response[foodId];
      return new Food(
        foodId,
        food.ownerId,
        food.title,
        food.imageUrl,
        food.date,
        food.quantity,
      );
    });

    setUpNotifs(userId, userEmail, loadedFood);

    dispatch({
      type: SET_FOOD,
      food: loadedFood,
      userFood: loadedFood,
    });
  } catch (err) {
    console.log('fetchFood error:', err);
    throw err;
  }
};
export const deleteFood = (foodId) => async (dispatch, getState) => {
  const { uid: userId, email: userEmail } = firebase.auth().currentUser;
  try {
    console.log('deleteFood:', foodId);
    firebase.database().ref(`food/${foodId}`).remove();
    dispatch({ type: DELETE_FOOD, pid: foodId });
    removeNotif(userId, userEmail, foodId);
  } catch (err) {
    console.log('deleteFood error:', err);
  }
};

export const createFood = (title, date, imageUrl, quantity) => async (
  dispatch,
) => {
  const { uid: userId, email: userEmail } = firebase.auth().currentUser;

  try {
    const id = firebase
      .database()
      .ref('food')
      .push({
        title,
        date,
        imageUrl,
        quantity,
        ownerId: userId,
      })
      .getKey();

    const food = {
      id,
      title,
      date,
      imageUrl,
      quantity,
    };

    dispatch({
      type: CREATE_FOOD,
      foodData: food,
    });

    addOrUpdateNotif(userId, userEmail, food);
  } catch (err) {
    console.log(err);
  }
};

export const updateFood = (foodId, title, date, imageUrl, quantity) => {
  console.log('updateFood', foodId, title, date, imageUrl, quantity);
  return async (dispatch) => {
    const { uid: userId, email: userEmail } = firebase.auth().currentUser;
    try {
      firebase.database().ref(`/food/${foodId}`).update({
        title,
        date,
        imageUrl,
        quantity,
        ownerId: userId,
      });

      const food = {
        title,
        date,
        imageUrl,
        quantity,
      };

      dispatch({
        type: UPDATE_FOOD,
        pid: foodId,
        foodData: food,
      });

      addOrUpdateNotif(userId, userEmail, food);
    } catch (err) {
      console.log(err);
    }
  };
};
