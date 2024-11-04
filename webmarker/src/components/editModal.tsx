import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateReading, deleteReading } from '../Database'; 

interface EditReadingModalProps {
  visible: boolean;
  onClose: () => void;
  reading: {
    id: number;
    title: string;
    chaptersRead: number;
    status: string;
    releaseDay: string;
    link: string;
  } | null;
  onLoadReadings: () => Promise<void>; // Adicionando a função para recarregar leituras
}

const EditReadingModal: React.FC<EditReadingModalProps> = ({ visible, onClose, reading, onLoadReadings }) => {
  const [title, setTitle] = useState('');
  const [chaptersRead, setChaptersRead] = useState('');
  const [status, setStatus] = useState('Em leitura');
  const [releaseDay, setReleaseDay] = useState('Segunda-feira');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (reading) {
      setTitle(reading.title);
      setChaptersRead(reading.chaptersRead.toString());
      setStatus(reading.status);
      setReleaseDay(reading.releaseDay);
      setLink(reading.link);
    }
  }, [reading]);

  const handleUpdate = async () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!title || !chaptersRead) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (reading) {
      const updatedReading = {
        id: reading.id,
        title,
        chaptersRead: Number(chaptersRead),
        status,
        releaseDay,
        link,
      };

      try {
        await updateReading(updatedReading.id, updatedReading);
        await onLoadReadings(); // Recarrega as leituras após a atualização
        onClose();
      } catch (error) {
        console.error("Erro ao atualizar a leitura:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (reading) {
      try {
        await deleteReading(reading.id);
        await onLoadReadings(); // Recarrega as leituras após a exclusão
        onClose();
      } catch (error) {
        console.error("Erro ao excluir a leitura:", error);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
          <Text style={styles.modalTitle}>Editar Leitura</Text>

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
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue) => setStatus(itemValue)}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Em leitura" value="Em leitura" />
              <Picker.Item label="Completo" value="Completo" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={releaseDay}
              style={styles.picker}
              onValueChange={(itemValue) => setReleaseDay(itemValue)}
              dropdownIconColor="#fff"
            >
              {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Link da obra"
            placeholderTextColor="#fff"
            value={link}
            onChangeText={setLink}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleUpdate}
            >
              <Text style={styles.addButtonText}>Alterar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#21133d',
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
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 15,
    backgroundColor: '#21133d',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    flex: 1,
    marginRight: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EditReadingModal;
