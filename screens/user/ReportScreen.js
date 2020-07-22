import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, Picker } from 'react-native';
import { Button } from 'react-native-elements';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import moment from 'moment';
import Svg, { Circle } from 'react-native-svg';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBtm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    width: 140,
    borderRadius: 15,
  },
});

const ReportScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
        </Svg>
        <View
          style={{
            width: 220,
            height: 220,
            borderRadius: 440,
            borderWidth: 2,
            borderColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            strokeDasharray: '8, 3',
            stroke: 3,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 40,
              color: Colors.primary,
              fontWeight: 'bold',
            }}
          >
            20%
          </Text>
          <Text
            style={{ textAlign: 'center', fontSize: 32, color: Colors.primary }}
          >
            Food Expired
          </Text>
        </View>
      </View>
      <View style={styles.containerBtm}>
        <Button
          title="VIEW"
          raised
          titleStyle={{ fontSize: 22 }}
          buttonStyle={styles.button}
        />
      </View>
    </View>
  );
};

ReportScreen.navigationOptions = (navData) => {
  return {
    headerTitle: `Monthly Report - ${moment().format('MMMM')}`, // long month
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
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
