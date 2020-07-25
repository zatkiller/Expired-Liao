import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform, Picker } from "react-native";
import { Button } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import Svg, { Circle, ForeignObject } from "react-native-svg";
import { useSelector } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	containerTop: {
		flex: 2,
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	containerBtm: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	buttonContainer: {
		position: "absolute",
		top: 50,
	},
	button: {
		backgroundColor: Colors.accent,
		width: 140,
		borderRadius: 15,
	},
});

const CIRCLE_RADIUS = 49;

const isExpired = ({ date }) => {
	return (
		moment(date, "DD-MM-YYYY") <
		moment(moment().format("DD-MM-YYYY"), "DD-MM-YYYY")
	);
};

const ReportScreen = ({ navigation }) => {
	const foodList = useSelector(
		(state) => state.food.userFood
	).filter(({ date }) =>
		moment(date, "DD-MM-YYYY").isSame(moment(), "month")
	);

	const numberExpired = foodList.reduce(
		(acc, cur) => acc + isExpired(cur) * 1,
		0
	);

	const fractionExpired = numberExpired / foodList.length;
	const percentageExpired = foodList.length ? 100 * fractionExpired : 0;

	const circumference = 2 * Math.PI * CIRCLE_RADIUS;
	const circumferenceOffset = (1 - fractionExpired) * circumference;

	return (
		<View style={styles.container}>
			<View style={styles.containerTop}>
				<Svg
					style={{ margin: 35 }}
					height="250px"
					width="250px"
					viewBox="0 0 100 100"
				>
					<ForeignObject x={0} y={0}>
						<View
							style={{
								height: 100,
								width: 100,
								borderStyle: "solid",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									textAlign: "center",
								}}
							>
								<Text
									style={{
										fontWeight: "bold",
										color: Colors.progress,
									}}
								>
									{percentageExpired.toFixed(0)}%
								</Text>
								{"\n"}
								<Text>Food Expired</Text>
							</Text>
						</View>
					</ForeignObject>
					<Circle
						stroke={Colors.complete}
						r={CIRCLE_RADIUS}
						cx="50px"
						cy="50px"
						fill="transparent"
						strokeWidth={2.5}
					/>
					<Circle
						stroke={Colors.progress}
						r={CIRCLE_RADIUS}
						cx="50px"
						cy="50px"
						fill="transparent"
						strokeWidth={2.5}
						strokeDasharray={circumference}
						strokeDashoffset={circumferenceOffset}
						transform={{
							rotation: 180,
							originX: 50,
							originY: 50,
						}}
					/>
				</Svg>
				<Text style={{ textAlign: "center", fontSize: 32 }}>
					<Text
						style={{
							textDecorationLine: "underline",
							color: Colors.highlight,
						}}
					>
						{numberExpired}
					</Text>{" "}
					<Text>food items</Text>
					{"\n"}
					<Text style={{ color: Colors.hightlight }}>
						expired liao!
					</Text>
				</Text>
			</View>
			<View style={styles.containerBtm}>
				<Button
					onPress={() => {
						navigation.navigate("Food");
					}}
					title="VIEW"
					raised
					titleStyle={{ fontSize: 22 }}
					containerStyle={styles.buttonContainer}
					buttonStyle={styles.button}
				/>
			</View>
		</View>
	);
};

ReportScreen.navigationOptions = (navData) => {
	return {
		headerTitle: `Monthly Report - ${moment().format("MMMM")}`, // long month
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

export default ReportScreen;
