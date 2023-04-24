import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
  const [selectedExpense, setSelectedExpense] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/expense`)
      .then((response) => {
        setListExpenses(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddObject = () => {
    if (inputExpense.length < 3) return;
    const expense: IExpenseInput = { expense: inputExpense, value: Number(inputValue) };

    axios.post(`${baseURL}/expense`, expense).then((response) => console.log(response.data));

    setInputExpense('');
    setInputValue('');
    setPopUp(false);
  };

  const handleupdateObject = (id?: number | null) => {
    if (inputExpense.length < 3) return;
    const expense: IExpenseInput = { expense: inputExpense, value: Number(inputValue) };

    axios.put(`${baseURL}/expense/${id}`, expense).then((response) => console.log(response.data));

    setInputExpense('');
    setInputValue('');
    setPopUp(false);
  };

  return (
    <View>
      {popUp && (
        <>
          <>
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
          </>
          {!selectedExpense ? (
            <Button title="Adicionar Despesa" onPress={handleAddObject} />
          ) : (
            <Button title="Atualizar Despesa" onPress={() => handleupdateObject(selectedExpense)} />
          )}
        </>
      )}
      {!popUp && <Button title="add despesa" onPress={() => setPopUp(true)} />}
      {listExpenses &&
        listExpenses.map((object) => (
          <View key={object.id.toString()}>
            <Text>{object.expense}</Text>
            <Text>{object.value}</Text>
            <Button
              title="Atualizar Despesa"
              onPress={() => {
                setPopUp(true);
                const id = object.id;
                setSelectedExpense(id);
              }}
            />
          </View>
        ))}
    </View>
  );
};
