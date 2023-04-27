import React from 'react';
import { View } from 'react-native';
import { ExpensesFixedList } from '../components/ExpensesFixedList';
import { styles } from '../styles/home.styled';

export default function Expenses() {
  return (
    <View style={styles.container}>
      <ExpensesFixedList />
    </View>
  );
}
