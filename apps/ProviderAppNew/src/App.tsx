import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import OnboardingScreen from './screens/OnboardingScreen';
import JobRequestsScreen from './screens/JobRequestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { store } from './store';
import { initI18n } from './i18n';

initI18n();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Jobs" component={JobRequestsScreen} />
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
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Home" component={HomeTabs} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ApiProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;