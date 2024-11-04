import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Release {
  id: number;
  title: string;
  releaseDay: string;
  status: string; // Adicionando status para filtrar as leituras
}

interface ReleasesListProps {
  readings: Release[];
}

const ReleasesList: React.FC<ReleasesListProps> = ({ readings }) => {
  // Criar um objeto para armazenar as leituras por dia da semana
  const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  
  // Filtrando as leituras para excluir aquelas com status "Completo"
  const filteredReadings = readings.filter(reading => reading.status !== 'Completo');

  const groupedReleases = daysOfWeek.reduce((acc, day) => {
    acc[day] = filteredReadings.filter(reading => reading.releaseDay === day);
    return acc;
  }, {} as Record<string, Release[]>);

  // Obter o índice do dia atual
  const todayIndex = new Date().getDay(); // 0 é Domingo, 1 é Segunda, etc.
  const today = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1]; // Ajustar para que Segunda-feira seja o primeiro

  return (
    <View style={styles.container}>
      {Object.keys(groupedReleases).map(day => {
        if (groupedReleases[day].length > 0) {
          return (
            <View key={day} style={styles.dayContainer}>
              {daysOfWeek.indexOf(day) >= daysOfWeek.indexOf(today) && (
                <>
                  <Text style={styles.dayTitle}>{day}</Text>
                  {groupedReleases[day].map(release => (
                    <Text key={release.id} style={styles.releaseItem}>{release.title}</Text>
                  ))}
                </>
              )}
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#21133d',
  },
  dayContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  dayTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    borderBottomWidth: 2, 
    borderBottomColor: '#fff', 
    width: '90%', 
    alignSelf: 'flex-start', 
    paddingBottom: 5, 
  },
  releaseItem: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 2,
  },
});

export default ReleasesList;
