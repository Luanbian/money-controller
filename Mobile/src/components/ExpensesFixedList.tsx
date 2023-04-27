import useSWR from 'swr';
import axios from 'axios';
import { baseURL } from '../api/api';
import { styles } from '../styles/todolist.styled';
import React, { useRef, useState } from 'react';
import { TextInputMask } from 'react-native-masked-text';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Modalize } from 'react-native-modalize';
import { View, TextInput, Pressable, Text } from 'react-native';

interface IExpenseInput {
  value: number;
  expense: string;
}

interface ListExpenses {
  id: number;
  value: number;
  expense: string;
  isPaid: boolean;
}

export const ExpensesFixedList = () => {
  const modalizeRef = useRef<Modalize>();
  const [popUp, setPopUp] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputExpense, setInputExpense] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<number | null>(null);
  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);
  const { data, error } = useSWR(`${baseURL}/expense`, fetcher);

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
  };

  const handleChangeIsPaid = (id: number) => {
    axios.put(`${baseURL}/expense/${id}/isPaid`).then((response) => console.log(response.data));
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
            <>
              <Pressable onPress={handleNewExpense}>
                <Text>Adicionar despesa</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => handleUpdateExpense(selectedExpense)}>
                <Text>Atualizar despesa</Text>
              </Pressable>
            </>
          )}
          <Pressable onPress={() => setPopUp(false)}>
            <Text>Voltar</Text>
          </Pressable>
        </>
      )}
      {!popUp && (
        <Pressable
          onPress={() => {
            setPopUp(true);
            setSelectedExpense(null);
          }}
        >
          <Text> Adicionar Despesa </Text>
        </Pressable>
      )}
      {data &&
        data.map((object: ListExpenses) => (
          <View key={object.id.toString()}>
            <View style={styles.cardAll}>
              <View style={styles.cardData}>
                <BouncyCheckbox
                  key={object.id}
                  isChecked={object.isPaid}
                  size={25}
                  text={object.expense}
                  onPress={() => handleChangeIsPaid(object.id)}
                />
                <Text>{object.value}</Text>
              </View>
              <View style={styles.cardData}>
                <Pressable
                  onPress={() => {
                    setPopUp(true);
                    setSelectedExpense(object.id);
                  }}
                >
                  <Text>Atualizar despesa</Text>
                </Pressable>
                <Pressable onPress={() => modalizeRef.current?.open()}>
                  <Text>Deletar despesa</Text>
                </Pressable>
                <View>
                  <Modalize ref={modalizeRef}>
                    <Pressable onPress={() => handleDeleteExpense(object.id)}>
                      <Text>Deletar despesa</Text>
                    </Pressable>
                    <Pressable onPress={() => modalizeRef.current?.close()}>
                      <Text>Voltar</Text>
                    </Pressable>
                  </Modalize>
                </View>
                <Pressable onPress={() => modalizeRef.current?.close()}>
                  <Text>Voltar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      {error && <Text>{error.message}</Text>}
    </View>
  );
};
