//Feita com Chatgpt

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import ListagemEventos from './ListagemEventos'; // caminho correto
import CadastroEvento from './CadastroEvento'; // caminho correto

const Stack = createNativeStackNavigator();

//Tela Home
const Home = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.titulo}>Tela Home</Text>
    <Button title="Ir para Lista de Eventos" onPress={() => navigation.navigate('Eventos')} />
    <View style={{ height: 16 }} />
    <Button title="Ir para Cadastro" onPress={() => navigation.navigate('CadastroEvento')} />
  </View>
);


//App com navegação
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
        <Stack.Screen name="Eventos" component={ListagemEventos} />
        <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  }
});
