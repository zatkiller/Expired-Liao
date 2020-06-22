import {
	DELETE_FOOD,
	CREATE_FOOD,
	UPDATE_FOOD,
	SET_FOOD,
} from "../actions/food";
import Food from "../../models/Food";

const initialState = {
	userFood: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_FOOD:
			return {
				userFood: action.userFood,
			};
		case CREATE_FOOD:
			const newFood = new Food(
				action.foodData.id,
				action.foodData.ownerId,
				action.foodData.title,
				action.foodData.date,
				action.foodData.quantity
			);

			return {
				...state,
				userFood: state.userFood.concat(newFood),
			};
		case UPDATE_FOOD:
			const foodIndex = state.userFood.findIndex(
				(food) => food.id === action.pid
			);
			const updatedFood = new Food(
				action.pid,
				state.userFood[foodIndex].ownerId,
				action.foodData.title,
				action.foodData.date,
				action.foodData.quantity
			);
			const updatedUserFood = [...state.userFood];
			updatedUserFood[foodIndex] = updatedFood;
			return {
				...state,
				userFood: updatedUserFood,
			};
		case DELETE_FOOD:
			return {
				...state,
				userFood: state.userFood.filter(
					(food) => food.id !== action.pid
				),
			};
	}
	return state;
};
