import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

import Food from '../../models/Food';

export const DELETE_FOOD = 'DELETE_FOOD';
export const CREATE_FOOD = 'CREATE_FOOD';
export const UPDATE_FOOD = 'UPDATE_FOOD';
export const SET_FOOD = 'SET_FOOD';

const LOCAL_STORE_PREFIX = '@ExpiredLiao:';

const asyncStoreSet = (key, value) => {
  try {
    AsyncStorage.setItem(`${LOCAL_STORE_PREFIX}:${key}`, value);
  } catch (e) {
    console.log('asyncStoreSet error', e);
  }
};

const asyncStoreGet = async (key, value) => {
  try {
    const value = await AsyncStorage.getItem(`${LOCAL_STORE_PREFIX}:${key}`);
    return value || '{}';
  } catch (e) {
    console.log('asyncStoreGet error', e);
  }
};

export const fetchFood = () => {
  return async (dispatch, getState) => {
    try {
      const { uid, email: userEmail } = firebase.auth().currentUser;

      const response =
        (
          await firebase
            .database()
            .ref('food')
            .orderByChild('ownerId')
            .equalTo(uid) // query only for results where ownerId==uid
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

      console.log(moment().format('DD-MM-YYYY'));

      const STORE_KEY = 'userNotifData';
      const userNotifData = JSON.parse(await asyncStoreGet(STORE_KEY));

      // cancel all pending notifications for user with uid
      if (userNotifData[uid] && userNotifData[uid].notifs) {
        userNotifData[uid].notifs.forEach(({ notifId }) => {
          Notifications.cancelScheduledNotificationAsync(notifId);
        });
      }

      userNotifData[uid] = {
        notifs: [],
      };

      // schedule notifications for all user uid's foods and
      // store their notifIds in userNotifData[uid].notifs
      loadedFood.forEach(async (food) => {
        const notifId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${userEmail} expiry warning!`,
            body: `${food.title} is expiring in 3 days on ${food.date}`,
          },
          trigger: {
            seconds: 5,
          },
        });
        userNotifData[uid].notifs.push({ foodId: food.id, notifId });
      });

      // update local async storage the new list of pending notifs for user
      asyncStoreSet(STORE_KEY, JSON.stringify(userNotifData));

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
};
export const deleteFood = (foodId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      console.log('delteFood:', foodId);
      firebase
        .database()
        .ref('food/' + foodId)
        .remove();
      dispatch({ type: DELETE_FOOD, pid: foodId });
    } catch (err) {
      console.log('deleteFood error:', err);
    }
  };
};

export const createFood = (title, date, imageUrl, quantity) => {
  return async (dispatch) => {
    const user = firebase.auth().currentUser;
    try {
      const id = firebase
        .database()
        .ref('food')
        .push({
          title,
          date,
          imageUrl,
          quantity,
          ownerId: user.uid,
        })
        .getKey();

      dispatch({
        type: CREATE_FOOD,
        foodData: {
          id,
          title,
          date,
          imageUrl,
          quantity,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateFood = (foodId, title, date, imageUrl, quantity) => {
  console.log(foodId, title, date, imageUrl, quantity);
  return async (dispatch) => {
    const user = firebase.auth().currentUser;
    try {
      firebase
        .database()
        .ref('/food/' + foodId)
        .update({
          title,
          date,
          imageUrl,
          quantity,
          ownerId: user.uid,
        });

      dispatch({
        type: UPDATE_FOOD,
        pid: foodId,
        foodData: {
          title,
          date,
          imageUrl,
          quantity,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};
