import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { insertReading } from '../Database'; 

interface AddReadingButtonProps {
  onAdd: () => void;
}

const AddReadingButton: React.FC<AddReadingButtonProps> = ({ onAdd }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [chaptersRead, setChaptersRead] = useState('');
  const [status, setStatus] = useState('');
  const [releaseDay, setReleaseDay] = useState('Segunda-feira');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleAddReading = async () => {
    // Limpar mensagens de erro ao iniciar a validação
    setError('');

    // Validação: título obrigatório
    if (!title) {
      setError('Por favor, preencha o título.');
      return; 
    }

    try {
      const newReading = {
        title,
        chaptersRead: chaptersRead ? parseInt(chaptersRead) : 0, // Padrão: 0 capítulos lidos
        status: status || 'Em leitura', // Padrão: "Em leitura"
        releaseDay,
        link,
      };

      await insertReading(newReading); // Chama a função para inserir leitura
      onAdd(); // Atualiza a lista de leituras no componente pai

      // Limpar os campos
      setTitle('');
      setChaptersRead('');
      setStatus('');
      setReleaseDay('Segunda-feira');
      setLink('');
      setModalVisible(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao adicionar leitura:", error);
      // Você pode mostrar um alerta ou mensagem para o usuário
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Nova Leitura</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Adicionar Nova Leitura</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#fff"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Qtd. capítulos lidos"
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={chaptersRead}
              onChangeText={setChaptersRead}
            />
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setStatus(value)}
                items={[
                  { label: 'Em leitura', value: 'Em leitura' },
                  { label: 'Completo', value: 'Completo' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Status', value: null }}
              />
            </View>

            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setReleaseDay(value)}
                items={[
                  { label: 'Segunda-feira', value: 'Segunda-feira' },
                  { label: 'Terça-feira', value: 'Terça-feira' },
                  { label: 'Quarta-feira', value: 'Quarta-feira' },
                  { label: 'Quinta-feira', value: 'Quinta-feira' },
                  { label: 'Sexta-feira', value: 'Sexta-feira' },
                  { label: 'Sábado', value: 'Sábado' },
                  { label: 'Domingo', value: 'Domingo' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Dia de lançamento', value: null }}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Link da obra"
              placeholderTextColor="#fff"
              value={link}
              onChangeText={setLink}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddReading}
            >
              <Text style={styles.addButtonText}>Adicionar Nova Leitura</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Estilos para o RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
});

// Estilos principais do componente
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#0C0727',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  pickerContainer: {
    borderBottomWidth: 2,
    borderColor: '#fff', 
    marginBottom: 15,
    backgroundColor: 'transparent', 
  },
  addButton: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#8c52ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AddReadingButton;
