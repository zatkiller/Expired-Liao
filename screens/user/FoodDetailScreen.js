import React from "react";
import {
	ScrollView,
	View,
	Text,
	Image,
	Button,
	StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";

const FoodDetailScreen = (props) => {
	const foodId = props.navigation.getParam("foodId");
	const selectedFood = useSelector((state) =>
		state.food.userFood.find((food) => food.id === foodId)
	);
	const editFoodHandler = (id) => {
		props.navigation.navigate("AddFood", { foodId: id });
	};

	return (
		<ScrollView>
			<Image
				style={styles.image}
				source={{ uri: selectedFood.imageUrl }}
			/>
			<Text style={styles.date}>Expiry Date: {selectedFood.date}</Text>
			<Text style={styles.quantity}>
				Quantity: {selectedFood.quantity}
			</Text>
			<View style={styles.actions}>
				<Button
					color={Colors.primary}
					title="Edit"
					onPress={() => {
						editFoodHandler(selectedFood.id);
					}}
				/>
			</View>
		</ScrollView>
	);
};

FoodDetailScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam("foodTitle"),
	};
};

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height: 300,
	},
	actions: {
		marginVertical: 10,
		alignItems: "center",
	},
	date: {
		fontSize: 20,
		color: "#888",
		textAlign: "center",
		marginVertical: 20,
		fontFamily: "open-sans-bold",
	},
	quantity: {
		fontFamily: "open-sans",
		fontSize: 14,
		textAlign: "center",
		marginHorizontal: 20,
	},
});

export default FoodDetailScreen;
