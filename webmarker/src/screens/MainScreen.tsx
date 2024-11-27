import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/header';
import Tab from '../components/tab';
import AddReadingButton from '../components/AddReadingButton';
import ReadingList from '../components/list'; 
import EditReadingModal from '../components/editModal'; 
import ReleasesList from '../components/ReleasesList'; 
import Filter from '../components/filter'; // Importação do novo componente
import { Reading } from '../types/reading'; 
import { init, fetchReadings, incrementChaptersRead } from '../Database'; 

const MainScreen = () => {
  const [selectedType, setSelectedType] = useState('Minhas Leituras');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentReading, setCurrentReading] = useState<Reading | null>(null);

  const loadReadings = async () => {
    try {
      const fetchedReadings = await fetchReadings();
      
      // Ordena e salva no estado principal
      const sortedReadings = fetchedReadings.sort((a, b) => {
        return (a.status === 'Completo' ? 1 : 0) - (b.status === 'Completo' ? 1 : 0);
      });

      setReadings(sortedReadings);
      setFilteredReadings(sortedReadings); // Inicializa também as leituras filtradas
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

  const handleSearch = (searchTerm: string) => {
    const filtered = readings.filter((reading) =>
      reading.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReadings(filtered);
  };

  const handleSort = (sortOption: 'A-Z' | 'Lançamento') => {
    const today = new Date().getDay(); // Dia da semana (0 = domingo, 1 = segunda...)
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const sorted = [...readings];

    if (sortOption === 'A-Z') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'Lançamento') {
      sorted.sort((a, b) => {
        const dayA = (daysOfWeek.indexOf(a.releaseDay) - today + 7) % 7;
        const dayB = (daysOfWeek.indexOf(b.releaseDay) - today + 7) % 7;
        return dayA - dayB;
      });
    }

    // Sempre mova leituras completas para o final
    sorted.sort((a, b) => (a.status === 'Completo' ? 1 : 0) - (b.status === 'Completo' ? 1 : 0));

    setFilteredReadings(sorted);
  };

  const handleEdit = (id: number) => {
    const readingToEdit = readings.find(reading => reading.id === id);
    setCurrentReading(readingToEdit || null);
    setEditModalVisible(true);
  };

  const handleAddChapter = async (id: number) => {
    try {
      await incrementChaptersRead(id);
      await loadReadings();
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
          <Filter onSearch={handleSearch} onSort={handleSort} />
          <ReadingList readings={filteredReadings} onEdit={handleEdit} onAddChapter={handleAddChapter} />
        </>
      )}

      {selectedType === 'Lançamentos' && (
        <ReleasesList readings={filteredReadings} />
      )}

      <EditReadingModal 
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        reading={currentReading}
        onLoadReadings={loadReadings} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0717',
  },
});

export default MainScreen;
