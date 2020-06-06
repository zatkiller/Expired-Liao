import React, { useState, useReducer, useEffect, useCallback } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	Platform,
	Alert,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as foodActions from "../../store/actions/food";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		};
	}
	return state;
};

const AddFoodScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const prodId = props.navigation.getParam("foodId");
	const editedFood = useSelector((state) =>
		state.food.userFood.find((prod) => prod.id === prodId)
	);
	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedFood ? editedFood.title : "",
			imageUrl: editedFood ? editedFood.imageUrl : "",
			description: editedFood ? editedFood.description : "",
			price: "",
		},
		inputValidities: {
			title: editedFood ? true : false,
			imageUrl: editedFood ? true : false,
			description: editedFood ? true : false,
			price: editedFood ? true : false,
		},
		formIsValid: editedFood ? true : false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert(
				"Wrong input!",
				"Please check the errors in the form.",
				[{ text: "Okay" }]
			);
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			if (editedFood) {
				await dispatch(
					foodActions.updateFood(
						prodId,
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl
					)
				);
			} else {
				await dispatch(
					foodActions.createFood(
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl,
						+formState.inputValues.price
					)
				);
			}
			props.navigation.goBack();
		} catch (err) {
			setError(err.message);
		}

		setIsLoading(false);
	}, [dispatch, prodId, formState]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
	}, [submitHandler]);

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior="padding"
			keyboardVerticalOffset={100}
		>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="title"
						label="Title"
						errorText="Please enter a valid title!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedFood ? editedFood.title : ""}
						initiallyValid={!!editedFood}
						required
					/>
					<Input
						id="imageUrl"
						label="Image Url"
						errorText="Please enter a valid image url!"
						keyboardType="default"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedFood ? editedFood.imageUrl : ""}
						initiallyValid={!!editedFood}
						required
					/>
					{editedFood ? null : (
						<Input
							id="price"
							label="Price"
							errorText="Please enter a valid price!"
							keyboardType="decimal-pad"
							returnKeyType="next"
							onInputChange={inputChangeHandler}
							required
							min={0.1}
						/>
					)}
					<Input
						id="description"
						label="Description"
						errorText="Please enter a valid description!"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangeHandler}
						initialValue={editedFood ? editedFood.description : ""}
						initiallyValid={!!editedFood}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

AddFoodScreen.navigationOptions = (navData) => {
	const submitFn = navData.navigation.getParam("submit");
	return {
		headerTitle: navData.navigation.getParam("foodId")
			? "Edit Food"
			: "Add Food",
		headerRight: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Save"
						iconName={
							Platform.OS === "android"
								? "md-checkmark"
								: "ios-checkmark"
						}
						onPress={submitFn}
					/>
				</HeaderButtons>
			);
		},
	};
};

const styles = StyleSheet.create({
	form: {
		margin: 20,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default AddFoodScreen;

// import React, { useState } from "react";
// import {
// 	Text,
// 	StyleSheet,
// 	View,
// 	Button,
// 	FlatList,
// 	ScrollView,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";

// import FoodItem from "../../components/app/FoodItem";
// import FoodInput from "../../components/app/FoodInput";

// const AddFoodScreen = (props) => {
// 	const [food, setFood] = useState([]);
// 	const [isAddMode, setIsAddMode] = useState(false);

// 	const addFoodHandler = (foodName, date, qty) => {
// 		setFood((currentFood) => [
// 			...currentFood,
// 			{
// 				id: Math.random().toString(),
// 				name: foodName,
// 				expiry: date,
// 				quantity: qty,
// 			},
// 		]);
// 		setIsAddMode(false);
// 	};

// 	const removeFoodHandler = (FoodID) => {
// 		setFood((currentFood) => {
// 			return currentFood.filter((Food) => Food.id !== FoodID);
// 		});
// 	};

// 	const cancelFoodAdditionHandler = () => {
// 		setIsAddMode(false);
// 	};

// 	return (
// 		<View style={styles.screen}>
// 			<View>
// 				<Button
// 					title="Add To Inventory"
// 					onPress={() => setIsAddMode(true)}
// 				/>
// 				<FoodInput
// 					visible={isAddMode}
// 					onAddFood={addFoodHandler}
// 					onCancel={cancelFoodAdditionHandler}
// 				/>
// 			</View>
// 			<ScrollView>
// 				<FlatList
// 					keyExtractor={(item, index) => item.id}
// 					data={food}
// 					renderItem={(itemData) => (
// 						<FoodItem
// 							id={itemData.item.id}
// 							onDelete={removeFoodHandler}
// 							title={itemData.item.name}
// 							expiry={itemData.item.expiry}
// 							quantity={itemData.item.quantity}
// 						/>
// 					)}
// 				/>
// 			</ScrollView>
// 		</View>
// 	);
// };

// AddFoodScreen.navigationOptions = (navData) => {
// 	return {
// 		headerTitle: "Add Food",
// 	};
// };

// export default AddFoodScreen;

// const styles = StyleSheet.create({
// 	screen: {
// 		padding: 50,
// 	},
// });
