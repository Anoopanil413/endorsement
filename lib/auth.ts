import { UserProfile, dbManager } from './indexedDB';

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const createDemoUser = (): UserProfile => ({
  id: 'demo-user',
  email: 'demo@maritime-endorser.com',
  name: 'Demo User',
  isAuthenticated: false,
  subscriptionStatus: 'free'
});

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'demo123') {
    const user: UserProfile = {
      id: 'current',
      email,
      name: 'Maritime Professional',
      isAuthenticated: true,
      subscriptionStatus: 'premium'
    };
    
    await dbManager.saveUserProfile(user);
    return user;
  }
  
  throw new Error('Invalid credentials');
};

export const logoutUser = async (): Promise<void> => {
  const demoUser = createDemoUser();
  await dbManager.saveUserProfile(demoUser);
};

export const getCurrentUser = async (): Promise<UserProfile> => {
  const user = await dbManager.getUserProfile();
  return user || createDemoUser();
};