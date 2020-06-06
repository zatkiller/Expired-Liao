import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

const ReportScreen = (props) => {
	return (
		<View>
			<Text>This is the report screen</Text>
		</View>
	);
};

ReportScreen.navigationOptions = (navData) => {
	return {
		headerTitle: "Report",
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

const styles = StyleSheet.create({});
