import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useMemo } from 'react';
import { Colors } from '@/constants/Colors';
import PokemonCard from '@/components/PokemonCard';
import { Typography } from '@/constants/Typography';

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

export default function RaidScreen() {

  // Mocking highly rated raid pokemons (just arbitrary strong types like Fire/Water/Fighting)
  const filteredData = useMemo(() => {
    return pokedexData.filter((item: any) => 
      item.types.includes('격투') || item.types.includes('에스퍼') || item.types.includes('불꽃')
    ).slice(0, 15);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={Typography.headlineLg}>레이드 추천</Text>
          <Text style={styles.subtitle}>현재 진행 중인 5성 레이드에서 가장 높은 DPS를 기록하는 포켓몬 목록입니다.</Text>
        </View>

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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainer,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
    lineHeight: 24,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 40,
    gap: 10,
  },
});
