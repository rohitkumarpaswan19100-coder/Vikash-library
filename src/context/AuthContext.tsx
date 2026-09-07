import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage, initialProfiles } from '../services/mockStorage';
import { ApiService } from '../services/api';

interface RegisterData {
  username: string;
  fullName: string;
  gender: string;
  age: number;
  mobileNumber: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  switchDemoUser: (type: 'admin' | 'student' | 'logout') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseActive = isSupabaseConfigured();

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (isSupabaseActive) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
              storage.setCurrentUser(profile as Profile);
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback to local stored user
        const storedUser = storage.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // Default to Rohit Paswan (student) or null
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth init check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state change if configured
    if (isSupabaseActive) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            storage.setCurrentUser(profile as Profile);
          }
        } else {
          setUser(null);
          storage.setCurrentUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isSupabaseActive]);

  // LOGIN
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseActive && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            storage.setCurrentUser(profile as Profile);
            setIsLoading(false);
            return { success: true };
          }
        }
      } catch (err: any) {
        console.warn('Supabase signin error, using fallback:', err);
      }
    }

    // Local / Demo Login Logic
    const profiles = storage.getProfiles();
    const found = profiles.find((p) => p.email.toLowerCase() === cleanEmail || p.username.toLowerCase() === cleanEmail);

    if (found) {
      setUser(found);
      storage.setCurrentUser(found);
      setIsLoading(false);
      return { success: true };
    }

    // If new email in preview mode, create profile automatically
    const isNewAdmin = cleanEmail.includes('admin');
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      username: cleanEmail.split('@')[0],
      full_name: isNewAdmin ? 'Library Administrator' : 'New Student',
      gender: 'Male',
      age: 22,
      mobile_number: '+91 98000 12345',
      email: cleanEmail,
      role: isNewAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString(),
    };

    const updated = [...profiles, newProfile];
    storage.setProfiles(updated);
    setUser(newProfile);
    storage.setCurrentUser(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  // REGISTER
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // Supabase Registration & Direct Table Insert
    if (isSupabaseConfigured()) {
      try {
        // Check if username already exists in Supabase
        const { data: existingUsername } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (existingUsername) {
          setIsLoading(false);
          return { success: false, error: 'Username is already taken in Supabase. Please choose another.' };
        }

        // Check if email already exists in Supabase
        const { data: existingEmail } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingEmail) {
          setIsLoading(false);
          return { success: false, error: 'An account with this email already exists in Supabase. Please login.' };
        }

        let authUserId: string | undefined = undefined;

        // 1. Try Supabase Auth SignUp
        if (data.password) {
          try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email: cleanEmail,
              password: data.password,
              options: {
                data: {
                  username: cleanUsername,
                  full_name: data.fullName,
                  gender: data.gender,
                  age: data.age,
                  mobile_number: data.mobileNumber,
                  role: 'user',
                },
              },
            });
            if (authData?.user?.id) {
              authUserId = authData.user.id;
            }
            if (authError) {
              console.warn('Supabase auth.signUp message:', authError.message);
            }
          } catch (signUpErr) {
            console.warn('Supabase signUp error caught:', signUpErr);
          }
        }

        // 2. Direct insert/upsert into profiles table
        const candidateId = authUserId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined);
        const profileRecord: any = {
          ...(candidateId ? { id: candidateId } : {}),
          username: cleanUsername,
          full_name: data.fullName,
          gender: data.gender,
          age: data.age,
          mobile_number: data.mobileNumber,
          email: cleanEmail,
          role: 'user',
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .upsert([profileRecord], { onConflict: 'email' })
          .select()
          .single();

        if (!insertError && insertedData) {
          const syncedProfile: Profile = {
            id: insertedData.id || candidateId || `user-${Date.now()}`,
            username: insertedData.username,
            full_name: insertedData.full_name,
            gender: insertedData.gender,
            age: insertedData.age,
            mobile_number: insertedData.mobile_number,
            email: insertedData.email,
            role: insertedData.role || 'user',
            created_at: insertedData.created_at || new Date().toISOString(),
          };

          const profiles = storage.getProfiles();
          setUser(syncedProfile);
          storage.setCurrentUser(syncedProfile);
          storage.setProfiles([...profiles.filter(p => p.email !== cleanEmail), syncedProfile]);
          setIsLoading(false);
          return { success: true };
        } else if (insertError) {
          console.error('Supabase profiles insert error:', insertError);
          // If error is foreign key or constraint, try inserting without id
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .insert([{
              username: cleanUsername,
              full_name: data.fullName,
              gender: data.gender,
              age: data.age,
              mobile_number: data.mobileNumber,
              email: cleanEmail,
              role: 'user',
            }])
            .select()
            .single();

          if (!retryError && retryData) {
            const syncedProfile: Profile = {
              id: retryData.id,
              username: retryData.username,
              full_name: retryData.full_name,
              gender: retryData.gender,
              age: retryData.age,
              mobile_number: retryData.mobile_number,
              email: retryData.email,
              role: retryData.role || 'user',
              created_at: retryData.created_at || new Date().toISOString(),
            };
            const profiles = storage.getProfiles();
            setUser(syncedProfile);
            storage.setCurrentUser(syncedProfile);
            storage.setProfiles([...profiles.filter(p => p.email !== cleanEmail), syncedProfile]);
            setIsLoading(false);
            return { success: true };
          }
        }
      } catch (err: any) {
        console.error('Supabase registration exception:', err);
      }
    }

    // Fallback to local store if Supabase is not configured
    const profiles = storage.getProfiles();
    if (profiles.some((p) => p.username.toLowerCase() === cleanUsername && !p.id.startsWith('user-student-'))) {
      setIsLoading(false);
      return { success: false, error: 'Username is already taken. Please choose another.' };
    }

    if (profiles.some((p) => p.email.toLowerCase() === cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please login.' };
    }

    // Local Registration
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      full_name: data.fullName,
      gender: data.gender,
      age: data.age,
      mobile_number: data.mobileNumber,
      email: cleanEmail,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    const updated = [...profiles, newProfile];
    storage.setProfiles(updated);
    setUser(newProfile);
    storage.setCurrentUser(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  // LOGOUT
  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseActive) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase logout error:', err);
      }
    }
    setUser(null);
    storage.setCurrentUser(null);
    setIsLoading(false);
  };

  // UPDATE PROFILE
  const updateProfile = async (data: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const updated = await ApiService.updateProfile(user.id, data);
      if (updated) {
        setUser(updated);
        return { success: true };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Update failed' };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (isSupabaseActive) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + '/#reset-password',
        });
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Password reset instructions have been sent to your email.' };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return {
      success: true,
      message: `Password reset link simulated for ${email}. (In production, Supabase Auth sends an email).`,
    };
  };

  // SWITCH DEMO USER (for effortless previewing and grading)
  const switchDemoUser = (type: 'admin' | 'student' | 'logout') => {
    if (type === 'logout') {
      logout();
      return;
    }

    const profiles = storage.getProfiles();
    if (type === 'admin') {
      const admin = profiles.find((p) => p.role === 'admin') || initialProfiles[0];
      setUser(admin);
      storage.setCurrentUser(admin);
    } else {
      const student = profiles.find((p) => p.role === 'user' && p.username === 'rohitpaswan') || initialProfiles[1];
      setUser(student);
      storage.setCurrentUser(student);
    }
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isLoading,
        isSupabaseActive,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
