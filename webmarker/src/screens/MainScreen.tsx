import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/header';
import Tab from '../components/tab';
import AddReadingButton from '../components/AddReadingButton';
import ReadingList from '../components/list'; 
import EditReadingModal from '../components/editmodal'; 
import ReleasesList from '../components/ReleasesList'; 
import { Reading } from '../types/reading'; 
import { init, fetchReadings, incrementChaptersRead } from '../Database'; 

const MainScreen = () => {
  const [selectedType, setSelectedType] = useState('Minhas Leituras');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentReading, setCurrentReading] = useState<Reading | null>(null);

  const loadReadings = async () => {
    try {
      const fetchedReadings = await fetchReadings();
      
      // Ordenando leituras para que as completas fiquem no final
      const sortedReadings = fetchedReadings.sort((a, b) => {
        return (a.status === 'Completo' ? 1 : 0) - (b.status === 'Completo' ? 1 : 0);
      });

      setReadings(sortedReadings);
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
    }
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await init();
        await loadReadings();
      } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
      }
    };

    initializeDatabase();
  }, []);

  const handleEdit = (id: number) => {
    const readingToEdit = readings.find(reading => reading.id === id);
    setCurrentReading(readingToEdit || null);
    setEditModalVisible(true);
  };

  const handleAddChapter = async (id: number) => {
    try {
      await incrementChaptersRead(id); // Chama a função para incrementar capítulos
      await loadReadings(); // Recarrega as leituras após a atualização
    } catch (error) {
      console.error("Erro ao adicionar capítulo:", error);
    }
  };

  const handleUpdate = async (updatedReading: Reading) => {
    try {
      await loadReadings(); 
      setEditModalVisible(false); 
    } catch (error) {
      console.error("Erro ao atualizar a leitura:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await loadReadings(); 
      setEditModalVisible(false); 
    } catch (error) {
      console.error("Erro ao excluir a leitura:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Tab selectedType={selectedType} setSelectedType={setSelectedType} />
      
      {selectedType === 'Minhas Leituras' && (
        <>
          <AddReadingButton onAdd={loadReadings} /> 
          <ReadingList readings={readings} onEdit={handleEdit} onAddChapter={handleAddChapter} />
        </>
      )}

      {selectedType === 'Lançamentos' && (
        <ReleasesList readings={readings} /> // Renderizando a lista de lançamentos
      )}

      <EditReadingModal 
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        reading={currentReading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onLoadReadings={loadReadings} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21133d',
  },
});

export default MainScreen;
