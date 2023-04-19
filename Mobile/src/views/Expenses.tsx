import React from 'react';
import { View } from 'react-native';
import { Todolist } from '../components/todolist';
import { styles } from '../styles/home.styled';

export default function Expenses() {
  return (
    <View style={styles.container}>
      <Todolist />
    </View>
  );
}
