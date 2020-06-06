import React, { useState } from 'react';
import { Text, StyleSheet, View, Button, FlatList, ScrollView } from 'react-native';

import FoodItem from './components/FoodItem'
import FoodInput from './components/FoodInput'
import { render } from 'react-dom';
//Testing git command
export default function App() {
  const [food, setFood] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);

  const addFoodHandler = (foodName, date, qty) => {
    setFood(currentFood => [
      ...currentFood,
      { id: Math.random().toString(), name: foodName, expiry: date, quantity: qty }]);
    setIsAddMode(false);
  };

  const removeFoodHandler = FoodID => {
    setFood(currentFood => {
      return currentFood.filter(Food => Food.id !== FoodID);
    });
  }

  const cancelFoodAdditionHandler = () => {
    setIsAddMode(false);
  }

  return (
    <View style={styles.screen}>
      <View>
        <Button title="Add To Inventory" onPress={() => setIsAddMode(true)} />
        <FoodInput visible={isAddMode}
          onAddFood={addFoodHandler}
          onCancel={cancelFoodAdditionHandler} />
      </View>
      <ScrollView >
        <FlatList
          keyExtractor={(item, index) => item.id}
          data={food}
          renderItem={itemData => (
            <FoodItem
              id={itemData.item.id}
              onDelete={removeFoodHandler}
              title={itemData.item.name}
              expiry={itemData.item.expiry}
              quantity={itemData.item.quantity} /> 
          )}
        />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
});
