import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { baseURL } from '../api/api';

interface IExpenseInput {
  value: number;
  expense: string;
}

interface ListExpenses {
  id: number;
  value: number;
  expense: string;
  isPaid: number | boolean;
}

export const Todolist = () => {
  const [popUp, setPopUp] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputExpense, setInputExpense] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  const handleNewExpense = () => {
    if (inputExpense.length < 3) return;
    const expense: IExpenseInput = { expense: inputExpense, value: Number(inputValue) };

    axios.post(`${baseURL}/expense`, expense).then((response) => console.log(response.data));

    setPopUp(false);
    setInputValue('');
    setInputExpense('');
  };

  const handleUpdateExpense = (id?: number | null) => {
    if (inputExpense.length < 3) return;
    const expense: IExpenseInput = { expense: inputExpense, value: Number(inputValue) };

    axios.put(`${baseURL}/expense/${id}`, expense).then((response) => console.log(response.data));

    setPopUp(false);
    setInputValue('');
    setInputExpense('');
  };

  const handleDeleteExpense = (id: number) => {
    axios.delete(`${baseURL}/expense/${id}`).then((response) => console.log(response.data));
    setConfirmDelete(false);
  };

  return (
    <View>
      {popUp && (
        <>
          <>
            <TextInput value={inputExpense} onChangeText={setInputExpense} placeholder="Nome da despesa" />
            <TextInputMask
              type={'money'}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Valor da despesa"
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
            <Button title="Adicionar Despesa" onPress={handleNewExpense} />
          ) : (
            <Button title="Atualizar Despesa" onPress={() => handleUpdateExpense(selectedExpense)} />
          )}
        </>
      )}
      {!popUp && <Button title="+" onPress={() => setPopUp(true)} />}
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
            <Button title="Deletar Despesa" onPress={() => setConfirmDelete(true)} />
            <Modal animationType="slide" transparent={true} visible={confirmDelete}>
              <View>
                <Text>Deseja realmente excluir esta despesa?</Text>
                <Button title="Deletar" onPress={() => handleDeleteExpense(object.id)} />
                <Button title="Cancelar" onPress={() => setConfirmDelete(false)} />
              </View>
            </Modal>
          </View>
        ))}
    </View>
  );
};
