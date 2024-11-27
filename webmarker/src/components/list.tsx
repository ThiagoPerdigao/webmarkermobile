import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from 'react-native';

interface ReadingItem {
  id: number;
  title: string;
  status: string;
  chaptersRead: number;
  link: string;
}

interface ReadingListProps {
  readings: ReadingItem[];
  onEdit: (id: number) => void;
  onAddChapter: (id: number) => void;
}

const list: React.FC<ReadingListProps> = ({ readings, onEdit, onAddChapter }) => {
  const renderItem = ({ item }: { item: ReadingItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => Linking.openURL(item.link)} style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <View style={styles.rowContainer}>
        {/* Coluna para o Status */}
        <View style={styles.statusColumn}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        {/* Coluna para Lidos e Botão + */}
        <View style={styles.chaptersColumn}>
          <View style={styles.chaptersContainer}>
            <View style={styles.chaptersBox}>
              <Text style={styles.chaptersRead}>
                Lidos: <Text style={styles.chaptersBold}>{item.chaptersRead}</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => onAddChapter(item.id)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Botão Editar */}
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item.id)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={readings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusColumn: {
    minWidth: 100, // Garante largura mínima para evitar quebra de linha
    maxWidth: 150, // Limita o tamanho para textos mais longos
    flexShrink: 1, // Permite reduzir se necessário em layouts menores
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
  },
  chaptersColumn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chaptersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chaptersBox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderTopLeftRadius: 3, // Arredonda apenas à esquerda
    borderBottomLeftRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: -1, // Remove espaço entre a borda e o botão
  },
  chaptersRead: {
    color: '#fff',
  },
  chaptersBold: {
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    paddingHorizontal: 15,
    borderTopRightRadius: 3, // Arredonda apenas à direita
    borderBottomRightRadius: 3,
    backgroundColor: '#8c52ff',
  },
  editButton: {
    marginLeft: 15, // Espaçamento para separar do botão anterior
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: '#8c52ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default list;
