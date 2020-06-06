import React from "react";
import {
	View,
	Text,
	FlatList,
	Button,
	Platform,
	Alert,
	StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import FoodItem from "../../components/app/FoodItem";
import Colors from "../../constants/Colors";
import * as foodActions from "../../store/actions/food";

const FoodDatabaseScreen = (props) => {
	const userFood = useSelector((state) => state.food.userFood);
	const dispatch = useDispatch();

	const editFoodHandler = (id) => {
		props.navigation.navigate("EditFood", { foodId: id });
	};

	const deleteHandler = (id) => {
		Alert.alert(
			"Are you sure?",
			"Do you really want to delete this item?",
			[
				{ text: "No", style: "default" },
				{
					text: "Yes",
					style: "destructive",
					onPress: () => {
						dispatch(foodActions.deleteFood(id));
					},
				},
			]
		);
	};

	if (userFood.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>No food found, maybe start creating some?</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={userFood}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<FoodItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						editFoodHandler(itemData.item.id);
					}}
				>
					<Button
						color={Colors.primary}
						title="Edit"
						onPress={() => {
							editFoodHandler(itemData.item.id);
						}}
					/>
					<Button
						color={Colors.primary}
						title="Delete"
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/>
				</FoodItem>
			)}
		/>
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
		headerRight: () => {
			return (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Add Food"
						iconName={
							Platform.OS === "android" ? "md-add" : "ios-add"
						}
						onPress={() => {
							navData.navigation.navigate("AddFood");
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
