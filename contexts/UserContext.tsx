import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, CountryTradition } from '../types';

interface UserContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  updateTradition: (tradition: CountryTradition) => void;
  toggleFavoritePrayer: (id: string) => void;
  toggleFavoriteAudio: (id: string) => void;
  updateSettings: (settings: Partial<UserProfile['settings']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('orthodox_compass_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const saveUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('orthodox_compass_user', JSON.stringify(u));
    // In real app, sync to Firebase 'users' collection here
  };

  const updateTradition = (tradition: CountryTradition) => {
    if (user) saveUser({ ...user, countryTradition: tradition });
  };

  const updateSettings = (settings: Partial<UserProfile['settings']>) => {
    if (user) saveUser({ ...user, settings: { ...user.settings, ...settings } });
  };

  const toggleFavoritePrayer = (id: string) => {
    if (!user) return;
    const isFav = user.favoritePrayerIds.includes(id);
    const newFavs = isFav 
      ? user.favoritePrayerIds.filter(fid => fid !== id) 
      : [...user.favoritePrayerIds, id];
    saveUser({ ...user, favoritePrayerIds: newFavs });
  };

  const toggleFavoriteAudio = (id: string) => {
    if (!user) return;
    const isFav = user.favoriteAudioIds.includes(id);
    const newFavs = isFav 
      ? user.favoriteAudioIds.filter(fid => fid !== id) 
      : [...user.favoriteAudioIds, id];
    saveUser({ ...user, favoriteAudioIds: newFavs });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateTradition, toggleFavoritePrayer, toggleFavoriteAudio, updateSettings }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};