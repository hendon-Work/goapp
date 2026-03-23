import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import { Colors } from '@/constants/Colors';
import PokemonCard from '@/components/PokemonCard';
import { Typography } from '@/constants/Typography';

const pokedexData = require('@/constants/pokedex.json');
const battleData = require('@/constants/pokemon_data.json');

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

// 헬퍼: 폼 이름(알로라, 가라르 등)을 제외하고 도감의 원본 이름과 매칭하는 함수
const normalizeName = (name: string) => {
  if (name.includes('XL')) name = name.replace('XL', '').trim();
  if (name.includes('알로라')) return name.replace('알로라', '').trim();
  if (name.includes('가라르')) return name.replace('가라르', '').trim();
  if (name.includes('히스이')) return name.replace('히스이', '').trim();
  if (name.includes('팔데아')) return name.replace('팔데아', '').trim();
  if (name.includes('그림자')) return name.replace('그림자', '').trim();
  return name;
};

export default function BattleLeagueScreen() {
  const [activeLeague, setActiveLeague] = useState('슈퍼리그');
  const leagues = ['슈퍼리그', '하이퍼리그', '마스터리그'];

  const filteredData = useMemo(() => {
    const leagueData = battleData?.battle_league_data?.[activeLeague];
    if (!leagueData) return [];
    
    // 가져올 티어 (S~S+, A~A+)
    const sTier = leagueData['S~S+ 티어'] || [];
    const aTier = leagueData['A~A+ 티어'] || [];
    
    const combined = [...sTier, ...aTier];
    
    // pokedexData와 매핑, 못찾으면 표시 안함
    const mapped = combined.map((bInfo: any) => {
      const normalName = normalizeName(bInfo.name);
      const pokeInfo = pokedexData.find((p: any) => p.name === normalName || p.name === bInfo.name);
      if (pokeInfo) {
        return {
          ...pokeInfo,
          battleName: bInfo.name, // 원래 이름 보존 (폼 구분용)
          moves: bInfo.moves
        };
      }
      return null;
    }).filter(Boolean);
    
    // 중복 제거 (도감 번호 기준)
    const unique = mapped.filter((v: any, i: number, a: any[]) => a.findIndex(t => t.no === v.no) === i);
    
    return unique.slice(0, 30); // 성능을 위해 상위 30마리만 출력
  }, [activeLeague]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={Typography.headlineLg}>배틀리그 추천</Text>
          <Text style={styles.subtitle}>현재 리그 메타를 지배하는 주요 포켓몬입니다.</Text>
        </View>

        <View style={styles.filterRow}>
          {leagues.map(league => {
            const isActive = activeLeague === league;
            return (
              <Pressable 
                key={league} 
                onPress={() => setActiveLeague(league)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{league}</Text>
              </Pressable>
            )
          })}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${item.no}-${index}`}
          renderItem={({ item }) => {
            const mainType = item.types[0];
            const colorType = TYPE_COLORS[mainType] || Colors.surfaceContainerHigh;
            const numberStr = item.no.toString().padStart(3, '0');
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.no}.png`;
            return (
              <PokemonCard 
                id={item.no} 
                name={item.battleName} 
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
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 9999, // Pill
  },
  filterChipActive: {
    backgroundColor: Colors.primary, // #bc0100
  },
  filterText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: Colors.onPrimary,
  },
  listContainer: {
    paddingTop: 24,
    paddingBottom: 40,
    gap: 10,
  },
});
