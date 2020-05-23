import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FoodItem = props => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onDelete.bind(this, props.id)}>
            <View style={styles.listItem} >
                <Text>
                    Item: {props.title}
                </Text>
                <Text>
                    Expiry Date: {props.expiry}
                </Text>
                <Text>
                    Quantity: {props.quantity}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#ccc',
        borderColor: "black",
        borderWidth: 1
    }
})

export default FoodItem;