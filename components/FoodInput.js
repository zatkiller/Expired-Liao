import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal } from 'react-native';

const FoodInput = props => {
    const [enteredFood, setEnteredFood] = useState('');
    const [enteredExpiry, setExpiry] = useState('');

    function FoodInputHandler(enteredText) {
        setEnteredFood(enteredText);
    }

    const addFoodHandler = () => {
        props.onAddFood(enteredFood);
        setEnteredFood('');
    }

    function ExpiryInputHandler(enteredText) {
        setEnteredFood(enteredText);
    }

    const addExpiryHandler = () => {
        props.onAddExpiry(enteredExpiry);
        setExpiry('');
    }

    return (
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Food Item"
                    style={styles.input}
                    onChangeText={FoodInputHandler}
                    value={enteredFood}
                />
                <View style={styles.buttonContainer}>
                    <View style={styles.buttons}>
                        <Button title="Add" onPress={addFoodHandler} />
                    </View>
                    <View style={styles.buttons}>
                        <Button title="Cancel" color="red"
                            onPress={props.onCancel} />
                    </View>
                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '80%',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%'
    },
    buttons: {
        width: '40%'
    }
})

export default FoodInput;