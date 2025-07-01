//Feita com Chatpgt

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';

const ListagemEventos = () => {
  const [eventos, setEventos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  //
  useEffect(() => {
    fetch('https://extranet.cebraspe.org.br/AvaliacaoCSA/BackEnd/')
      .then(res => res.json()) 
      .then(json => {
        const dadosFormatados = json.map(item => item.message);
        setEventos(dadosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar eventos:', error);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
      <Text style={styles.nome}>{item.nomeEvento}</Text>
      <Text>{item.webSite}</Text>
      <Text>Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text>Candidatos: {item.numeroMaxCandidato}</Text>
      <Text>Endereço: {item.endereco.logradouro}, {item.endereco.bairro}, {item.endereco.cidade} - {item.endereco.uf}</Text>
    </View>
  );

  return (
    <FlatList
      data={eventos}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.lista}
    />
  );
};

const styles = StyleSheet.create({
  lista: {
    padding: 16
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default ListagemEventos;
