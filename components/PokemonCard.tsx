import { View, Text, StyleSheet, Image, Pressable, Platform, DimensionValue } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

interface PokemonCardProps {
  id: string;
  name: string;
  types: string[];
  imageUrl: string;
  numberStr: string;
  colorType?: string;
}

export default function PokemonCard({ id, name, types, imageUrl, numberStr, colorType = Colors.tertiary }: PokemonCardProps) {
  return (
    <Link href={`/${id}`} asChild>
      <Pressable style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}>
        <View style={styles.card}>
          <Text style={styles.numberText}>{numberStr}</Text>
          <Text style={styles.nameText}>{name}</Text>
          
          <View style={styles.typesRow}>
            {types.map((type) => (
              <View key={type} style={[styles.typeChip, { backgroundColor: colorType }]}>
                <Text style={styles.typeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Asymmetrical Sprite overlapping the top-right */}
        <Image style={styles.sprite} source={{ uri: imageUrl }} resizeMode="contain" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // 10px vertical gap required by DesignMD, but we need more for the overlapping image
    marginBottom: 24, 
    position: 'relative',
    overflow: 'visible',
    marginTop: 20, // space for the sprite to stick out
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24, // xl
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: Colors.onSurface,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 8, // higher elevation to render shadows correctly on Android
    zIndex: 1,
  },
  numberText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  nameText: {
    ...Typography.headlineLg,
    fontSize: 24, // smaller than full screen header
    lineHeight: 32,
    color: Colors.onSurface,
  },
  typesRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4, // sm rule from design MD
  },
  typeText: {
    ...Typography.labelSm,
    color: Colors.onPrimary,
  },
  sprite: {
    position: 'absolute',
    right: -10,
    top: -32, // Breaking the container boundary aggressively
    width: 120,
    height: 120,
    zIndex: 10,
    // Add ambient lighting to the sprite itself
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
});
