import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { baseURL } from '../api/api';

interface MyObject {
  expense: string;
  value: number;
}

export const Todolist = () => {
  const [popUp, setPopUp] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputNumber, setInputNumber] = useState('');
  const [objectArray, setObjectArray] = useState<MyObject[]>([]);

  const handleAddObject = () => {
    if (inputText.length < 3) return;
    const expense: MyObject = { expense: inputText, value: Number(inputNumber) };
    setObjectArray([...objectArray, expense]);

    axios.post(`${baseURL}/expense`, expense).then((response) => console.log(response.data));

    setInputText('');
    setInputNumber('');
    setPopUp(false);
  };

  return (
    <View>
      {popUp && (
        <View>
          <TextInput value={inputText} onChangeText={setInputText} placeholder="Nome da despesa" />
          <TextInputMask
            value={inputNumber}
            onChangeText={setInputNumber}
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
      {objectArray.map((object, index) => (
        <View key={index}>
          <Text>{object.expense}</Text>
          <Text>{object.value}</Text>
        </View>
      ))}
    </View>
  );
};
