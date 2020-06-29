import Food from '../../models/Food';

export const DELETE_FOOD = 'DELETE_FOOD';
export const CREATE_FOOD = 'CREATE_FOOD';
export const UPDATE_FOOD = 'UPDATE_FOOD';
export const SET_FOOD = 'SET_FOOD';
import * as firebase from 'firebase';

function writeUserData(ownerId, title, date, imageUrl, quantity) {
  firebase
    .database()
    .ref('users/' + userId)
    .set({
      ownerId: userId,
      title: title,
      date: date,
      imageUrl: imageUrl,
      quantity: quantity,
    });
}

export const fetchFood = () => {
  return async (dispatch, getState) => {
    try {
      const { uid } = firebase.auth().currentUser;
      console.log(uid);
      const response = (
        await firebase
          .database()
          .ref('food')
          .orderByChild('ownerId')
          .equalTo(uid) // query only for results where ownerId==uid
          .once('value')
      ).val();

      console.log(response);

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
        pid: id,
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
