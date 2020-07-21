import React, { useState, useReducer, useEffect, useCallback } from 'react';
import {
  TextInput,
  View,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import HeaderButton from '../../components/UI/HeaderButton';
import * as foodActions from '../../store/actions/food';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import ImagePicker from '../../components/app/ImagePicker';
import DatePicker from '../../components/app/DatePicker';

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    return {
      formIsValid: Object.values(updatedValidities).reduce(
        (prev, cur) => prev && cur,
        true,
      ),
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AddFoodScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const foodId = props.navigation.getParam('foodId');
  const editedFood = useSelector((state) =>
    state.food.userFood.find((food) => food.id === foodId),
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedFood ? editedFood.title : '',
      imageUrl: editedFood ? editedFood.imageUrl : '',
      date: editedFood ? editedFood.date : '',
      quantity: editedFood ? editedFood.quantity : '',
    },
    inputValidities: {
      title: !!editedFood,
      imageurl: true,
      date: !!editedFood,
      quantity: !!editedFood,
    },
    formIsValid: !!editedFood,
  });

  const [imageUrl, setImageUrl] = useState('');
  const imageTakenHandler = (url) => {
    setImageUrl(url);
  };

  // update food not working for some reason
  // state updates not working. Could be the callback function
  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' },
      ]);
      return;
    }
    setIsLoading(true);

    if (editedFood) {
      dispatch(
        foodActions.updateFood(
          foodId,
          formState.inputValues.title,
          formState.inputValues.date,
          imageUrl ? imageUrl : editedFood.imageUrl,
          formState.inputValues.quantity,
        ),
      );
    } else {
      dispatch(
        foodActions.createFood(
          formState.inputValues.title,
          formState.inputValues.date,
          imageUrl,
          formState.inputValues.quantity,
        ),
      );
    }
    props.navigation.goBack();

    setIsLoading(false);
  }, [dispatch, foodId, formState, imageUrl]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedFood ? editedFood.title : ''}
            initiallyValid={!!editedFood}
            required
          />
          <ImagePicker
            onImageTaken={imageTakenHandler}
            imageUrl={editedFood ? editedFood.imageUrl : ''}
          />
          <Input
            id="quantity"
            label="Quantity"
            errorText="Please enter a valid quantity!"
            keyboardType="numeric"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedFood ? editedFood.quantity.toString() : ''}
            initiallyValid={!!editedFood}
            required
            min={1}
          />
          <Input
            id="date"
            label="Expiry Date (DD-MM-YYYY)"
            value={formState.inputValues.date}
            style={{ marginBottom: 10 }}
            editable={false}
          />
          <DatePicker
            initialValue={
              editedFood
                ? moment(editedFood.date, 'DD-MM-YYYY').toDate()
                : moment().toDate()
            }
            setDate={(date) => inputChangeHandler('date', date, true)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

AddFoodScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('foodId')
      ? 'Edit Food'
      : 'Add Food',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

export default AddFoodScreen;
