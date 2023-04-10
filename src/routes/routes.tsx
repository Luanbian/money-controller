/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from '../views/Home';
import History from '../views/History';
import Graph from '../views/Graph';
import Expenses from '../views/Expenses';

const Tab = createMaterialTopTabNavigator();

interface Icons {
  name: string;
  color: string;
}

function TabIcon({ name, color }: Icons) {
  return <Icon name={name} size={25} color={color} />;
}

function Routes() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'money';
            } else if (route.name === 'History') {
              iconName = 'history';
            } else if (route.name === 'Graph') {
              iconName = 'pie-chart';
            } else {
              iconName = 'home';
            }
            return <TabIcon name={iconName} color={color} />;
          },
          tabBarShowLabel: false,
        })}
        tabBarPosition="bottom"
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="Graph" component={Graph} />
        <Tab.Screen name="Expenses" component={Expenses} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
