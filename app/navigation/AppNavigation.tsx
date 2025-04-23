import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Profile from '@screens/Profile';
import ChatBot from '@root/app/screens/ChatBot';
import CalendarEvents from '../screens/CalendarEvents';
import FlightList from '@root/app/screens/FlightList';
import FlightsDetail from '../screens/FlightsDetail';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBar, View} from 'react-native';
import Home from '../screens/Home';

// Create Stack Navigator for nested screens
const Stack = createNativeStackNavigator();

// Create Tab Navigator for bottom navigation
const Tab = createBottomTabNavigator();

// Home Stack to handle navigation inside the Home screen (e.g., flight details)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Flight" component={FlightList} /> */}
      <Stack.Screen name="Flight" component={Home} />
      <Stack.Screen
        name="FlightDetail"
        options={{headerTitle: 'Flight Details ✈️'}}
        component={FlightsDetail}
      />
      <Stack.Screen name="ChatBot" component={ChatBot} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
const AppNavigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          height: insets.top,
          width: '100%',
          backgroundColor: '#1E90FF',
        }}
      />
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#1E90FF',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: {height: 60},
            tabBarLabelStyle: {fontSize: 14},
          }}>
          {/* Home Tab */}
          <Tab.Screen
            name="Flight"
            component={HomeStack}
            options={{
              headerShown: false,
              tabBarLabel: 'Flights',
              tabBarIcon: ({color, size}) => (
                <Icon name="flight" size={24} color="#1E90FF" />
              ),
            }}
          />

          <Tab.Screen
            name="CalendarEvents"
            component={CalendarEvents}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="calendar-today" size={24} color="#1E90FF" />
              ),
            }}
          />
          {/* Profile Tab */}
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="person" size={24} color="#1E90FF" />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default AppNavigation;
