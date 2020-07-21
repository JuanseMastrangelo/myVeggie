import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import ScannerHistory from '../components/ScannerHistory';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabTreeParamList } from '../types';


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Scanner"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Scanner"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-barcode" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Recetas"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-pizza" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Historial"
        component={TabTreeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-ribbon" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{
          headerTitle: '',
          headerStatusBarHeight: -30,
          cardOverlayEnabled: true,
        }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{
          headerTitle: '',
          headerStatusBarHeight: -30,
          cardOverlayEnabled: true,
        }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabTreeStack = createStackNavigator<TabTreeParamList>();

function TabTreeNavigator() {
  return (
    <TabTreeStack.Navigator>
      <TabTreeStack.Screen
        name="TabTreeScreen"
        component={ScannerHistory}
        options={{
          headerTitle: '',
          headerStatusBarHeight: -30,
          cardOverlayEnabled: true,
        }}
      />
    </TabTreeStack.Navigator>
  );
}
