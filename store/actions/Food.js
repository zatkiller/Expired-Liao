import Food from "../../models/Food";

export const DELETE_FOOD = "DELETE_FOOD";
export const CREATE_FOOD = "CREATE_FOOD";
export const UPDATE_FOOD = "UPDATE_FOOD";
export const SET_FOOD = "SET_FOOD";

export const fetchFood = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		try {
			const response = await fetch(
				"https://expired-liao.firebaseio.com/food.json"
			);

			if (!response.ok) {
				throw new Error("Something went wrong!");
			}

			const resData = await response.json();
			const loadedFood = [];

			for (const key in resData) {
				loadedFood.push(
					new Food(
						key,
						resData[key].ownerId,
						resData[key].title,
						resData[key].date,
						resData[key].quantity
					)
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
				method: "DELETE",
			}
		);

		if (!response.ok) {
			throw new Error("Something went wrong!");
		}
		dispatch({ type: DELETE_FOOD, pid: foodId });
	};
};

export const createFood = (title, date, quantity) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;
		const response = await fetch(
			`https://expired-liao.firebaseio.com/food.json?auth=${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					date,
					quantity,
					ownerId: userId,
				}),
			}
		);

		const resData = await response.json();
		dispatch({
			type: CREATE_FOOD,
			foodData: {
				id: resData.name,
				title,
				date,
				quantity,
				ownerId: userId,
			},
		});
	};
};

export const updateFood = (id, title, date, quantity) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const response = await fetch(
			`https://expired-liao.firebaseio.com/food/${id}.json?auth=${token}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					date,
					quantity,
				}),
			}
		);
		if (!response.ok) {
			throw new Error("Something went wrong!");
		}

		dispatch({
			type: UPDATE_FOOD,
			pid: id,
			foodData: {
				title,
				date,
				quantity
			},
		});
	};
};
