import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

export const useUser = () => {
  const [phone, setPhone] = useState<string | null>(() => {
    // Try to get phone from localStorage on initialization
    return localStorage.getItem('userPhone');
  });

  const [user, setUser] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Save phone to localStorage whenever it changes
  useEffect(() => {
    if (phone) {
      localStorage.setItem('userPhone', phone);
    } else {
      localStorage.removeItem('userPhone');
    }
  }, [phone]);

  // Validate stored phone number on app startup
  useEffect(() => {
    if (phone && !user) {
      validateStoredUser();
    }
  }, [phone]);

  const validateStoredUser = async () => {
    if (!phone) return;
    
    setIsValidating(true);
    try {
      // Try to get user progress to validate the phone number
      await apiService.getUserProgress(phone);
      // If successful, user exists and is valid
      console.log('Stored user validated successfully');
    } catch (error) {
      console.log('Stored user validation failed, clearing localStorage');
      // If failed, clear the stored phone number
      setPhone(null);
      localStorage.removeItem('userPhone');
    } finally {
      setIsValidating(false);
    }
  };

  const login = (userPhone: string, userData?: any) => {
    setPhone(userPhone);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setPhone(null);
    setUser(null);
    localStorage.removeItem('userPhone');
  };

  return {
    phone,
    user,
    isLoggedIn: !!phone,
    isValidating,
    login,
    logout,
    validateStoredUser
  };
}; 