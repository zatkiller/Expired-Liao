import React, { useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	Button,
	FlatList,
	ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import * as authActions from "../../store/actions/auth.js";
import HeaderButton from "../../components/UI/HeaderButton";
import FoodItem from "../../components/app/FoodItem";
import FoodInput from "../../components/app/FoodInput";

const FoodDatabaseScreen = (props) => {
	const dispatch = useDispatch();
	// const [food, setFood] = useState([]);
	// const [isAddMode, setIsAddMode] = useState(false);

	// const addFoodHandler = (foodName, date, qty) => {
	// 	setFood((currentFood) => [
	// 		...currentFood,
	// 		{
	// 			id: Math.random().toString(),
	// 			name: foodName,
	// 			expiry: date,
	// 			quantity: qty,
	// 		},
	// 	]);
	// 	setIsAddMode(false);
	// };

	// const removeFoodHandler = (FoodID) => {
	// 	setFood((currentFood) => {
	// 		return currentFood.filter((Food) => Food.id !== FoodID);
	// 	});
	// };

	// const cancelFoodAdditionHandler = () => {
	// 	setIsAddMode(false);
	// };

	return (
		<View>
			<Text>Food Database Screen</Text>
		</View>
		// <View style={styles.screen}>
		// 	<View>
		// 		<Button
		// 			title="Add To Inventory"
		// 			onPress={() => setIsAddMode(true)}
		// 		/>
		// 		<FoodInput
		// 			visible={isAddMode}
		// 			onAddFood={addFoodHandler}
		// 			onCancel={cancelFoodAdditionHandler}
		// 		/>
		// 	</View>
		// 	<ScrollView>
		// 		<FlatList
		// 			keyExtractor={(item, index) => item.id}
		// 			data={food}
		// 			renderItem={(itemData) => (
		// 				<FoodItem
		// 					id={itemData.item.id}
		// 					onDelete={removeFoodHandler}
		// 					title={itemData.item.name}
		// 					expiry={itemData.item.expiry}
		// 					quantity={itemData.item.quantity}
		// 				/>
		// 			)}
		// 		/>
		// 	</ScrollView>
		// </View>
	);
};

FoodDatabaseScreen.navigationOptions = (navData) => {
	return {
		headerTitle: "Food Items",
		headerLeft: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Menu"
						iconName={
							Platform.OS === "android" ? "md-menu" : "ios-menu"
						}
						onPress={() => {
							navData.navigation.toggleDrawer();
						}}
					/>
				</HeaderButtons>
			);
		},
	};
};

export default FoodDatabaseScreen;

const styles = StyleSheet.create({
	screen: {
		padding: 50,
	},
});
