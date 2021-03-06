import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import Card from '../UI/Card';

const PLACEHOLDER_IMAGE_URL =
  'https://lh3.googleusercontent.com/proxy/MUp7U5Tvs9BvaiT-6scWoY5oxX7FyC6RXml7FrWXx6yPMnHDZUfS6Y6xv-3lFM7FHwjbyBN8QJ88az3u_wztLrlzASObbTysu1YNHvVaZaYU4LoGqcE';

const FoodItem = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.food}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: props.image || PLACEHOLDER_IMAGE_URL,
                }}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.date}>Expiry Date: {props.date}</Text>
              <Text style={styles.quantity}>Quantity: {props.quantity}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  food: {
    height: 300,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10,
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2,
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    marginVertical: 1,
  },
  quantity: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20,
  },
});

export default FoodItem;
