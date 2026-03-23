import { View, Text, StyleSheet, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { BlurView } from 'expo-blur';
import { useMemo, useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';

const pokedexData = require('@/constants/pokedex.json');

const { width } = Dimensions.get('window');

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

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [description, setDescription] = useState('도감 정보를 불러오는 중입니다...');

  const pokemon = useMemo(() => {
    return pokedexData.find((p: any) => p.no.toString() === id?.toString()) || pokedexData[0];
  }, [id]);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.no}/`);
        const data = await response.json();
        const koEntry = data.flavor_text_entries.find((entry: any) => entry.language.name === 'ko');
        if (koEntry) {
          setDescription(koEntry.flavor_text.replace(/[\n\f]/g, ' '));
        } else {
          setDescription('한국어 도감 설명이 존재하지 않습니다.');
        }
      } catch (e) {
        setDescription('도감 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchDescription();
  }, [pokemon.no]);

  const mainType = pokemon.types[0];
  const bg = TYPE_COLORS[mainType] || Colors.surfaceContainerHigh;
  const numberStr = pokemon.no.toString().padStart(3, '0');
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.no}.png`;
  
  const weaknessesText = pokemon.weaknesses ? 
    Object.entries(pokemon.weaknesses)
      .map(([mult, types]) => `[${mult}] ${types}`)
      .join('\n')
    : '없음';

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const pokemonIdStr = pokemon.no.toString();
  const isCaptured = isFavorite(pokemonIdStr);

  const toggleFavorite = () => {
    if (isCaptured) {
      removeFavorite(pokemonIdStr);
    } else {
      addFavorite(pokemonIdStr);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Shift */}
      <View style={[styles.headerBg, { backgroundColor: bg }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Navigation / Glassmorphism */}
        <BlurView intensity={70} tint="light" style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← back</Text>
          </Pressable>
        </BlurView>

        <View style={styles.imageContainer}>
          <Text style={styles.bgNumber}>{numberStr}</Text>
          <Image source={{ uri: imageUrl }} style={styles.mainImage} resizeMode="contain" />
        </View>

        <View style={styles.sheetContainer}>
          <Text style={Typography.displayLg}>{pokemon.name}</Text>
          <View style={styles.typesRow}>
            {pokemon.types.map((t: string) => (
              <View key={t} style={[styles.typeBadge, { backgroundColor: bg }]}>
                <Text style={styles.typeText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={Typography.titleMd}>도감 설명</Text>
            <Text style={styles.descText}>{description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={Typography.titleMd}>세대</Text>
            <Text style={styles.descText}>{pokemon.generation || '공개되지 않음'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={Typography.titleMd}>약점 정보</Text>
            <Text style={styles.descText}>{weaknessesText}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button (Glass/Gradient inspired) */}
      <View style={styles.fabWrapper}>
        <BlurView intensity={20} tint="light" style={styles.fabContainer}>
           <Pressable onPress={toggleFavorite} style={({ pressed }) => [styles.fab, isCaptured && styles.fabRelease, pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] }]}>
              <Text style={[styles.fabText, isCaptured && styles.fabTextRelease]}>{isCaptured ? '놓아주기' : '포획하기'}</Text>
           </Pressable>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '40%',
    opacity: 0.25,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  navBar: {
    marginTop: 60,
    marginHorizontal: 24,
    borderRadius: 9999, // full pill for glassmorphism
    overflow: 'hidden',
    padding: 14,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249,249,249,0.7)', // 70% opacity surface
  },
  backButton: {
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.onSurface,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
    position: 'relative',
    height: 260,
    zIndex: 10,
  },
  mainImage: {
    width: 250,
    height: 250,
    zIndex: 10,
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
  },
  bgNumber: {
    ...Typography.displayLg,
    fontSize: 120, // Display-LG (3.5rem) bleeding off or massive
    position: 'absolute',
    opacity: 0.05,
    top: 20,
    zIndex: -1,
  },
  sheetContainer: {
    backgroundColor: Colors.surfaceContainerLowest, // #ffffff
    paddingHorizontal: 32,
    paddingVertical: 56,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    marginTop: -80, // Negative margin to create overlap
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 8,
    zIndex: 2,
    minHeight: 500,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 40, // More breathing room
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6, // smaller padding for type tag
    borderRadius: 4, // sm radius for tags
  },
  typeText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  section: {
    marginBottom: 32,
  },
  descText: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant, // High contrast text hierarchy
    marginTop: 8,
    lineHeight: 24,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  fabContainer: {
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  fab: {
    backgroundColor: Colors.primary, // #bc0100
    borderRadius: 9999,
    paddingVertical: 20,
    paddingHorizontal: 64,
  },
  fabRelease: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  fabText: {
    ...Typography.titleMd,
    color: Colors.onPrimary,
  },
  fabTextRelease: {
    color: Colors.onSurface,
  },
});
