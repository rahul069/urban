/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { initI18n } from './src/i18n';
import { mockWorker } from './src/services/mock';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SearchScreen from './src/screens/SearchScreen';
import BookingScreen from './src/screens/BookingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider } from './src/context/AuthContext';
import { ApiProvider } from './src/context/ApiContext';

initI18n();

if (process.env.NODE_ENV === 'development') {
  mockWorker.start();
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ApiProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeTabs} />
                <Stack.Screen name="Booking" component={BookingScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ApiProvider>
      </AuthProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
