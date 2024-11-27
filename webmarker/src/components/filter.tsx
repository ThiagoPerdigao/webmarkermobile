import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import weekIcon from '../../assets/week.png'; // Certifique-se de que os caminhos estão corretos
import azIcon from '../../assets/az.png'; // Certifique-se de que os caminhos estão corretos

interface FilterProps {
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: 'A-Z' | 'Lançamento') => void;
}

const Filter: React.FC<FilterProps> = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState<'A-Z' | 'Lançamento'>('A-Z');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    onSearch(text); // Chama a função de callback para informar o componente pai
  };

  const handleSort = () => {
    const nextSort = currentSort === 'A-Z' ? 'Lançamento' : 'A-Z';
    setCurrentSort(nextSort);
    onSort(nextSort); // Chama a função de callback para informar o componente pai
  };

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por nome..."
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Botão de ordenação */}
      <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
        <Image
          source={currentSort === 'A-Z' ? azIcon : weekIcon} // Alterna entre os ícones
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    color: '#fff',
    marginRight: 10,
    backgroundColor: '#2e2e40',
    padding: 7,
    fontSize:16,
  },
  sortButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    backgroundColor: '#8c52ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 18, // Largura do ícone
    height: 18, // Altura do ícone
    resizeMode: 'contain', // Para garantir que a proporção do ícone seja mantida
  },
});

export default Filter;
