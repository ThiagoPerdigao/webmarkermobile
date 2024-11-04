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
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{item.status}</Text>
        <View style={styles.chaptersContainer}>
          <Text style={styles.chaptersRead}>Lidos: <Text style={styles.chaptersBold}>{item.chaptersRead}</Text></Text>
          <TouchableOpacity style={styles.button} onPress={() => onAddChapter(item.id)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onEdit(item.id)}>
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
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  titleContainer: {
    marginBottom: 5, // Espaçamento entre o título e o restante
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 16,
    color: '#fff',
  },
  chaptersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chaptersRead: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5, 
  },
  chaptersBold: {
    fontWeight: 'bold',
  },
  button: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#8c52ff',
  },
  buttonText: {
    color: '#fff',
  },
});

export default list;
