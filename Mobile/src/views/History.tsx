import axios from 'axios';
import React from 'react';
import { Text } from 'react-native';

export default function History() {
  axios
    .get('http://192.168.0.24:3030/history')
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error));

  return <Text>History</Text>;
}
