import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import { NotesProvider } from './src/context/NotesContext';
import NotesListScreen from './src/screens/NotesListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon, label }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesList" component={NotesListScreen} />
    <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="NotesTab"
      component={NotesStack}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon="📝" label="Notes" />
        ),
      }}
    />
    <Tab.Screen
      name="SettingsTab"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon="⚙️" label="Settings" />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NotesProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </NotesProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tabLabelFocused: {
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default App;
