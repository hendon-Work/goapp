import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useMemo } from 'react';
import { Colors } from '@/constants/Colors';
import PokemonCard from '@/components/PokemonCard';
import { Typography } from '@/constants/Typography';
import { useFavorites } from '@/contexts/FavoritesContext';

const pokedexData = require('@/constants/pokedex.json');

const TYPE_COLORS: Record<string, string> = {
  '불꽃': Colors.primary,
  '물': Colors.secondary,
  '풀': Colors.tertiary,
  '전기': '#ffcb09',
  '독': '#8a2be2',
  '악': '#3f3f3f',
  '얼음': '#82cfff',
  '고스트': '#5c5b5b',
  '벌레': '#78C850',
  '노말': '#acadad',
  '비행': '#8f9bff',
  '땅': '#d1a600',
  '페어리': '#ffafa9',
  '에스퍼': '#ff5540',
  '강철': '#9c9d9d',
  '바위': '#956d67',
  '격투': '#a40100',
  '드래곤': '#0001b7',
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  const filteredData = useMemo(() => {
    return pokedexData.filter((item: any) => favorites.includes(item.no.toString()));
  }, [favorites]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={Typography.headlineLg}>즐겨찾기</Text>
          <Text style={styles.subtitle}>관심 있는 포켓몬을 수집하고 관리하세요.</Text>
        </View>

        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.no}
            renderItem={({ item }) => {
              const mainType = item.types[0];
              const colorType = TYPE_COLORS[mainType] || Colors.surfaceContainerHigh;
              const numberStr = item.no.toString().padStart(3, '0');
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.no}.png`;
              return (
                <PokemonCard 
                  id={item.no} 
                  name={item.name} 
                  types={item.types} 
                  imageUrl={imageUrl} 
                  numberStr={numberStr} 
                  colorType={colorType} 
                />
              );
            }}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 즐겨찾기한 포켓몬이 없습니다.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 40,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
  }
});
