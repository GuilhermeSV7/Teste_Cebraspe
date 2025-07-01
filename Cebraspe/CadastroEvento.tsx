import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const RegistroForm = () => {
  const [nomeEvento, setNomeEvento] = useState('');
  const [webSite, setWebSite] = useState('');
  const [numeroMaxCandidato, setNumeroMaxCandidato] = useState('');
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/300.png');
  const [mensagem, setMensagem] = useState('');
  const [respostaAPI, setRespostaAPI] = useState(null);

  const [data, setData] = useState(() => {
    const hojeMais30 = new Date();
    hojeMais30.setDate(hojeMais30.getDate() + 30);
    return hojeMais30.toISOString();
  });

  const [endereco, setEndereco] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });

  const atualizarCampo = (campo: string, valor: string) => {
    setEndereco(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const buscarEnderecoPorCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setMensagem('O CEP deve conter 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMensagem('CEP não encontrado.');
        return;
      }

      setEndereco(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || '',
        cep: cepLimpo,
      }));

      setMensagem('');
    } catch (error) {
      setMensagem(`Erro ao buscar CEP: ${error.message}`);
    }
  };

  const registrarDados = async () => {
    try {
      const response = await fetch('https://extranet.cebraspe.org.br/AvaliacaoCSA/BackEnd/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeEvento,
          webSite,
          data,
          numeroMaxCandidato: Number(numeroMaxCandidato),
          endereco: {
            ...endereco,
            cep: endereco.cep.replace(/\D/g, ''),
          },
          imageUrl,
        }),
      });

      const dataResposta = await response.json();
      setRespostaAPI(dataResposta);

      setMensagem(
        response.ok
          ? 'Dados registrados com sucesso!'
          : `Erro ao registrar: ${
              Array.isArray(dataResposta.message)
                ? dataResposta.message.join('\n')
                : dataResposta.message || 'Erro desconhecido'
            }`
      );
    } catch (error) {
      setMensagem(`Erro de conexão: ${error.message}`);
    }
  };

  return (
    <View>
      <TextInput placeholder="Nome do Evento" value={nomeEvento} onChangeText={setNomeEvento} />
      <TextInput placeholder="Website" value={webSite} onChangeText={setWebSite} />
      <TextInput placeholder="Data ISO" value={data} onChangeText={setData} />
      <TextInput
        placeholder="Número Máximo de Candidatos"
        value={numeroMaxCandidato}
        onChangeText={setNumeroMaxCandidato}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Logradouro"
        value={endereco.logradouro}
        onChangeText={(text) => atualizarCampo('logradouro', text)}
      />
      <TextInput
        placeholder="Número"
        value={endereco.numero}
        onChangeText={(text) => atualizarCampo('numero', text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Complemento"
        value={endereco.complemento}
        onChangeText={(text) => atualizarCampo('complemento', text)}
      />
      <TextInput
        placeholder="Bairro"
        value={endereco.bairro}
        onChangeText={(text) => atualizarCampo('bairro', text)}
      />
      <TextInput
        placeholder="Cidade"
        value={endereco.cidade}
        onChangeText={(text) => atualizarCampo('cidade', text)}
      />
      <TextInput
        placeholder="UF"
        value={endereco.uf}
        onChangeText={(text) => atualizarCampo('uf', text)}
      />
      <TextInput
        placeholder="CEP"
        value={endereco.cep}
        onChangeText={(text) => {
          atualizarCampo('cep', text);
          if (text.replace(/\D/g, '').length === 8) buscarEnderecoPorCep(text);
        }}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="URL da Imagem"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Button title="Registrar" onPress={registrarDados} />
      {mensagem ? <Text>{mensagem}</Text> : null}
      {respostaAPI && <Text>Resposta da API: {JSON.stringify(respostaAPI)}</Text>}
    </View>
  );
};

export default RegistroForm;
