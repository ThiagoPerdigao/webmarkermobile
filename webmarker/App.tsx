import React from 'react';
import { StatusBar } from 'react-native'; // Importando o StatusBar
import MainScreen from './src/screens/MainScreen';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C0717" />
      <MainScreen />
    </>
  );
};

export default App;
