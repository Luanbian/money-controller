import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { baseURL } from '../api/api';

interface IExpenseInput {
  expense: string;
  value: number;
}

interface ListExpenses {
  id: number;
  expense: string;
  value: number;
  isPaid: number | boolean;
}

export const Todolist = () => {
  const [popUp, setPopUp] = useState(false);
  const [inputExpense, setInputExpense] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [listExpenses, setListExpenses] = useState<ListExpenses[]>([]);

  const handleAddObject = () => {
    if (inputExpense.length < 3) return;
    const expense: IExpenseInput = { expense: inputExpense, value: Number(inputValue) };

    axios.post(`${baseURL}/expense`, expense).then((response) => console.log(response.data));

    setInputExpense('');
    setInputValue('');
    setPopUp(false);
  };

  return (
    <View>
      {popUp && (
        <View>
          <TextInput value={inputExpense} onChangeText={setInputExpense} placeholder="Nome da despesa" />
          <TextInputMask
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Valor da despesa"
            type={'money'}
            options={{
              precision: 2,
              separator: '.',
              delimiter: '.',
              unit: '',
              suffixUnit: '',
            }}
            keyboardType="numeric"
          />
          <Button title="Adicionar Despesa" onPress={handleAddObject} />
        </View>
      )}
      {!popUp && <Button title="+" onPress={() => setPopUp(true)} />}
      {listExpenses.map((object, index) => (
        <View key={index}>
          <Text>{object.expense}</Text>
          <Text>{object.value}</Text>
        </View>
      ))}
    </View>
  );
};
