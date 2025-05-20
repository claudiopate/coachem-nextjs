"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  phone: string | null;
  level: string | null;
  preferredSport: string | null;
  notes: string | null;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  error: null,
  refreshProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: React.ReactNode;
  profileId?: string;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children, profileId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile with ID:', profileId);
      
      if (!profileId) {
        throw new Error('No profile ID provided');
      }

      console.log('Making API request to:', `/api/profile/${profileId}`);
      const response = await fetch(`/api/profile/${profileId}`);
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      console.log('Received profile data:', profileData);

      if (!profileData) {
        throw new Error('Profile not found');
      }

      return {
        id: profileData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        image: profileData.image,
        phone: profileData.phone,
        level: profileData.level,
        preferredSport: profileData.preferredSport,
        notes: profileData.notes
      };
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    try {
      console.log('Starting profile refresh');
      setLoading(true);
      const data = await fetchProfile();
      console.log('Setting profile data:', data);
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error in refreshProfile:', err);
      setProfile(null);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ProfileProvider useEffect triggered with profileId:', profileId);
    if (profileId) {
      refreshProfile();
    }
  }, [profileId]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}; 