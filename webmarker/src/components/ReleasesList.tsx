import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';

interface Release {
  id: number;
  title: string;
  releaseDay: string;
  status: string; // Status da leitura (ex: "Completo", "Em Progresso")
  link: string; // Adicionado campo link para redirecionamento
}

interface ReleasesListProps {
  readings: Release[];
}

const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

// Função para obter o dia da semana atual dinamicamente
const getToday = (): string => {
  const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ...
  return daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1];
};

// Função para reorganizar os dias da semana colocando os anteriores ao "hoje" no final
const reorderDays = (days: string[], today: string): string[] => {
  const todayIndex = days.indexOf(today);
  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
};

// Função para validar e abrir um link
const openLink = (url: string) => {
  // Verifica se o link possui protocolo válido, caso contrário, adiciona "https://"
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Tenta abrir o link, com tratamento de erros
  Linking.openURL(url).catch(err => {
    console.error('Erro ao abrir o link:', err);
    Alert.alert('Erro', 'Não foi possível abrir o link. Verifique se o endereço é válido.');
  });
};

// Componente para exibir uma seção de lançamentos de um dia específico
const DaySection: React.FC<{ day: string; releases: Release[] }> = ({ day, releases }) => (
  <View style={[styles.dayContainer, day !== getToday() && styles.separator]}>
    <Text style={[styles.dayTitle, day === getToday() && styles.highlightToday]}>{day}</Text>
    {releases.length > 0 ? (
      releases.map(release => (
        <TouchableOpacity
          key={release.id}
          style={styles.releaseItem}
          onPress={() => openLink(release.link)} // Chama a função corrigida para abrir o link
        >
          <Text style={styles.releaseTitle}>{release.title}</Text>
        </TouchableOpacity>
      ))
    ) : (
      <Text style={styles.noReleasesText}>Nenhum lançamento</Text>
    )}
  </View>
);

const ReleasesList: React.FC<ReleasesListProps> = ({ readings }) => {
  const today = getToday();

  // Reorganizar os dias da semana dinamicamente
  const reorderedDays = reorderDays(daysOfWeek, today);

  // Filtrar e agrupar leituras usando useMemo para otimização
  const groupedReleases = useMemo(() => {
    // Filtra leituras excluindo as com status "Completo"
    const filteredReadings = readings.filter(reading => reading.status !== 'Completo');

    // Agrupa leituras por dia da semana
    return daysOfWeek.reduce((acc, day) => {
      acc[day] = filteredReadings.filter(reading => reading.releaseDay === day);
      return acc;
    }, {} as Record<string, Release[]>);
  }, [readings]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {reorderedDays.map(day => {
          const releases = groupedReleases[day] || [];
          return <DaySection key={day} day={day} releases={releases} />;
        })}
        {/* Mensagem global para quando não houver lançamentos em nenhum dia */}
        {Object.values(groupedReleases).flat().length === 0 && (
          <Text style={styles.emptyMessage}>Nenhum lançamento disponível.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0C0717',
  },
  container: {
    padding: 10,
  },
  dayContainer: {
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 10,
  },
  separator: {
    borderTopWidth: 2,
    borderTopColor: '#fff',
    paddingTop: 15,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    width: '90%',
    alignSelf: 'flex-start',
  },
  highlightToday: {
    color: '#fff', // Cor destaque para "Hoje" removido
  },
  releaseItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 3,
    borderRadius: 3,
    backgroundColor: '#2E2E40',
  },
  releaseTitle: {
    fontSize: 16,
    color: '#fff',
  },
  noReleasesText: {
    fontSize: 16,
    color: '#aaa',
    fontStyle: 'italic',
    paddingVertical: 5,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReleasesList;
