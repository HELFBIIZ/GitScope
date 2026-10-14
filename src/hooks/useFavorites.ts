import { useCallback, useEffect, useState } from 'react';
import type { FavoriteUser } from '../types/github';

const FAVORITES_STORAGE_KEY = 'gitscope-favorites';

function readFavorites(): FavoriteUser[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteUser[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: FavoriteUser[]) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteUser[]>(readFavorites);

  useEffect(() => {
    writeFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((user: FavoriteUser) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.login.toLowerCase() === user.login.toLowerCase())) return prev;
      return [...prev, user];
    });
  }, []);

  const removeFavorite = useCallback((login: string) => {
    setFavorites((prev) => prev.filter((f) => f.login.toLowerCase() !== login.toLowerCase()));
  }, []);

  const isFavorite = useCallback(
    (login: string) => favorites.some((f) => f.login.toLowerCase() === login.toLowerCase()),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (user: FavoriteUser) => {
      if (isFavorite(user.login)) {
        removeFavorite(user.login);
      } else {
        addFavorite(user);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
