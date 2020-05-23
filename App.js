import React, { useState } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';

import FoodItem from './components/FoodItem'
import FoodInput from './components/FoodInput'

export default function App() {
  const [food, setFood] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);

  const addFoodHandler = FoodTitle => {
    setFood(currentFood => [
      ...currentFood,
      { id: Math.random().toString(), value: FoodTitle }]);
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
      <Button title="Add new Food" onPress={() => setIsAddMode(true)} />
      <FoodInput visible={isAddMode}
        onAddFood={addFoodHandler}
        onCancel={cancelFoodAdditionHandler} />
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={food}
        renderItem={itemData => (
          <FoodItem
            id={itemData.item.id}
            onDelete={removeFoodHandler}
            title={itemData.item.value} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
});
