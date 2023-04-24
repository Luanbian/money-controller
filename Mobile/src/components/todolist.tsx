import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, Modal } from 'react-native';
import { styles } from '../styles/todolist.styled';
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

  const handleUpdateExpense = (id: number) => {
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
    <View style={styles.container}>
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
            <>
              <Pressable onPress={handleNewExpense}>
                <Text>Adicionar despesa</Text>
              </Pressable>
              <Pressable onPress={() => setPopUp(false)}>
                <Text>Voltar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => handleUpdateExpense(selectedExpense)}>
                <Text>Atualizar despesa</Text>
              </Pressable>
              <Pressable onPress={() => setPopUp(false)}>
                <Text>Voltar</Text>
              </Pressable>
            </>
          )}
        </>
      )}
      {!popUp && (
        <Pressable
          onPress={() => {
            setPopUp(true);
            setSelectedExpense(null);
          }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}> + </Text>
        </Pressable>
      )}
      {listExpenses &&
        listExpenses.map((object) => (
          <View key={object.id.toString()}>
            <View style={styles.cardExpense}>
              <View>
                <Text>{object.expense}</Text>
                <Text>{object.value}</Text>
              </View>
              <View>
                <Pressable
                  onPress={() => {
                    setPopUp(true);
                    setSelectedExpense(object.id);
                  }}
                >
                  <Text>Atualizar despesa</Text>
                </Pressable>
                <Pressable onPress={() => setConfirmDelete(true)}>
                  <Text>Deletar despesa</Text>
                </Pressable>
              </View>
            </View>
            <Modal animationType="slide" transparent={true} visible={confirmDelete}>
              <View>
                <Text>Deseja realmente excluir esta despesa?</Text>
                <Pressable onPress={() => handleDeleteExpense(object.id)}>
                  <Text>Deletar</Text>
                </Pressable>
                <Pressable onPress={() => setConfirmDelete(false)}>
                  <Text>Cancelar</Text>
                </Pressable>
              </View>
            </Modal>
          </View>
        ))}
    </View>
  );
};
