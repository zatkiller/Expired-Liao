import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	Button,
	Platform,
	Alert,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import FoodItem from "../../components/app/FoodItem";
import Colors from "../../constants/Colors";
import * as foodActions from "../../store/actions/food";

const FoodDatabaseScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const userFood = useSelector((state) => state.food.userFood);
	const dispatch = useDispatch();

	const loadProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(foodActions.fetchFood());
		} catch (err) {
			setError(err.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setIsLoading, setError]);

	const editFoodHandler = (id) => {
		props.navigation.navigate("AddFood", { foodId: id });
	};

	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch, loadProducts]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate("FoodDetail", {
			foodId: id,
			foodTitle: title,
		});
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

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>An error occurred!</Text>
				<Button
					title="Try again"
					onPress={loadProducts}
					color={Colors.primary}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && userFood.length === 0) {
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
			// onRefresh={loadProducts}
			// refreshing={isRefreshing}
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
