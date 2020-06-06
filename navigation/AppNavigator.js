import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import AddFoodScreen from "../screens/user/AddFoodScreen";
import FoodDatabaseScreen from "../screens/user/FoodDatabaseScreen";
import Report from "../screens/user/ReportScreen";
import AuthScreen from "../screens/login/AuthenticationScreen";
import StartupScreen from "../screens/StartupScreen";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth.js";

const defaultNavOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === "android" ? Colors.primary : "",
	},
	headerTitleStyle: {
		fontFamily: "open-sans-bold",
	},
	headerBackTitleStyle: {
		fontFamily: "open-sans",
	},
	headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const FoodDatabaseNavigator = createStackNavigator(
	{
		Food: FoodDatabaseScreen,
		AddFood: AddFoodScreen,
	},
	{
		navigationOptions: {
			drawerIcon: (drawerConfig) => (
				<Ionicons
					name={Platform.OS === "android" ? "md-list" : "ios-list"}
					size={23}
					color={drawerConfig.tintColor}
				/>
			),
		},
		defaultNavigationOptions: defaultNavOptions,
	}
);

const ReportNavigator = createStackNavigator(
	{
		Report: Report,
	},
	{
		navigationOptions: {
			drawerIcon: (drawerConfig) => (
				<Ionicons
					name={
						Platform.OS === "android" ? "md-create" : "ios-create"
					}
					size={23}
					color={drawerConfig.tintColor}
				/>
			),
		},
		defaultNavigationOptions: defaultNavOptions,
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Food: FoodDatabaseNavigator,
		Reports: ReportNavigator,
	},
	{
		contentOptions: {
			activeTintColor: Colors.primary,
		},
		contentComponent: (props) => {
			const dispatch = useDispatch();
			return (
				<View style={{ flex: 1, paddingTop: 20 }}>
					<SafeAreaView
						forceInset={{ top: "always", horizontal: "never" }}
					>
						<DrawerItems {...props} />
						<Button
							title="Logout"
							color={Colors.primary}
							onPress={() => {
								dispatch(authActions.logout());
								// props.navigation.navigate('Auth');
							}}
						/>
					</SafeAreaView>
				</View>
			);
		},
	}
);

const AuthNavigator = createStackNavigator(
	{
		Auth: AuthScreen,
	},
	{
		defaultNavigationOptions: defaultNavOptions,
	}
);

const MainNavigator = createSwitchNavigator({
	Startup: StartupScreen,
	Auth: AuthNavigator,
	App: AppNavigator,
});

export default createAppContainer(MainNavigator);
