import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabNavigationProps = {
  selectedType: string;
  setSelectedType: (type: string) => void;
};

const tab: React.FC<TabNavigationProps> = ({ selectedType, setSelectedType }) => {
  const types = ['Minhas Leituras', 'Lançamentos'];

  return (
    <View style={styles.tabContainer}>
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[styles.tab, selectedType === type ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={styles.tabText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: '#fff',
  },
  activeTab: {
    borderBottomWidth: 4,
    borderColor: '#8c52ff',
  },
  inactiveTab: {},
  tabText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default tab;
