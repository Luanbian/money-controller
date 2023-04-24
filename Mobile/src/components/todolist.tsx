import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

interface MyObject {
  text: string;
  value: number | string;
}

export const Todolist = () => {
  const [popUp, setPopUp] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputNumber, setInputNumber] = useState('');
  const [objectArray, setObjectArray] = useState<MyObject[]>([]);

  const handleAddObject = () => {
    if (inputText.length < 3) return;
    const expense: MyObject = { text: inputText, value: inputNumber };
    setObjectArray([...objectArray, expense]);
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
              separator: ',',
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
          <Text>{object.text}</Text>
          <Text>{object.value}</Text>
        </View>
      ))}
    </View>
  );
};
