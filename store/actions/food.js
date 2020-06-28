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
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://expired-liao.firebaseio.com/food.json',
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedFood = [];

      for (const key in resData) {
        loadedFood.push(
          new Food(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].date,
            resData[key].quantity,
          ),
        );
      }

      dispatch({
        type: SET_FOOD,
        food: loadedFood,
        userFood: loadedFood.filter((food) => food.ownerId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteFood = (foodId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://expired-liao.firebaseio.com/food/${foodId}.json?auth=${token}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_FOOD, pid: foodId });
  };
};

export const createFood = (title, date, imageUrl, quantity) => {
  return async (dispatch) => {
    const user = firebase.auth().currentUser;
    try {
      // pushes a new object under 'food' in the DB and sets that object's
      // attributes. I wonder what the UUID is like
      const response = await firebase.database().ref('food').push().set({
        title,
        date,
        imageUrl,
        quantity,
        ownerId: user.uid,
      });
      console.log(response);
      // probably wanna dispatch something here to add new food item to
      // existing list of food items
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateFood = (id, title, date, imageUrl, quantity) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://expired-liao.firebaseio.com/food/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          date,
          imageUrl,
          quantity,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_FOOD,
      pid: id,
      foodData: {
        title,
        date,
        imageUrl,
        quantity,
      },
    });
  };
};
