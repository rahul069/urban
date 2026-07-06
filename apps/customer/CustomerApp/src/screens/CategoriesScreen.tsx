import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

const categories = [
  { id: 'cleaning', name: 'cleaning' },
  { id: 'plumbing', name: 'plumbing' },
  { id: 'electrical', name: 'electrical' },
  { id: 'handyman', name: 'handyman' },
];

const CategoriesScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('categories.title')}</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('Search', { category: item.id })}
          >
            <Text style={styles.categoryText}>{t(`categories.${item.name}`)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 18,
  },
});

export default CategoriesScreen;