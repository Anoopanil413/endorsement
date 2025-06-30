'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import EndorsementPanel from '@/components/endorsement/EndorsementPanel';
import HistoryPanel from '@/components/history/HistoryPanel';
import UploadPanel from '@/components/upload/UploadPanel';
import SubscriptionPanel from '@/components/subscription/SubscriptionPanel';
import { UserProfile, dbManager } from '@/lib/indexedDB';
import { getCurrentUser, logoutUser, createDemoUser } from '@/lib/auth';
import { toast } from 'sonner';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('endorse');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await dbManager.init();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setUser(createDemoUser());
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.name}!`);
  };

  const handleDemoMode = async () => {
    const demoUser = createDemoUser();
    await dbManager.saveUserProfile(demoUser);
    setUser(demoUser);
    toast.success('Welcome to Demo Mode!');
  };

  const handleLogout = async () => {
    await logoutUser();
    const demoUser = createDemoUser();
    setUser(demoUser);
    setActiveTab('endorse');
    toast.success('Signed out successfully');
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="text-white text-lg font-semibold">Initializing Maritime Endorser...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onDemoMode={handleDemoMode}
      />
    );
  }

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'endorse':
        return <EndorsementPanel />;
      case 'history':
        return <HistoryPanel />;
      case 'upload':
        return <UploadPanel user={user} onUserUpdate={handleUserUpdate} />;
      case 'subscription':
        return <SubscriptionPanel user={user} />;
      default:
        return <EndorsementPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAuthenticated={user.isAuthenticated}
      />
      <main className="pb-6">
        {renderActivePanel()}
      </main>
    </div>
  );
}