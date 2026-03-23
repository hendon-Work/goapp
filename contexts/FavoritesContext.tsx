import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextData {
  favorites: string[];
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('@poke_favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (id: string) => {
    try {
      const newFavorites = [...favorites, id];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('@poke_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const newFavorites = favorites.filter((favId) => favId !== id);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('@poke_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
