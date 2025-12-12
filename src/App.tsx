import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Scanner from './components/Scanner';
import MapScreen from './components/MapScreen';
import Profile from './components/Profile';
import RewardsShop from './components/RewardsShop';
import Navigation from './components/Navigation';
import FloatingChatbot from './components/FloatingChatbot';
import { Toaster } from './components/ui/sonner';

export interface User {
  email: string;
  name: string;
  points: number;
  deposits: number;
  badges: string[];
  avatar?: string;
}

export type Screen = 'scanner' | 'map' | 'rewards' | 'profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('scanner');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('rosyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('rosyUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('rosyUser');
    setCurrentScreen('scanner');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('rosyUser', JSON.stringify(updatedUser));
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Toaster />
      
      {/* Content */}
      <div className="pb-20">
        {currentScreen === 'scanner' && (
          <Scanner user={user!} updateUser={updateUser} />
        )}
        {currentScreen === 'map' && <MapScreen />}
        {currentScreen === 'rewards' && (
          <RewardsShop user={user!} updateUser={updateUser} />
        )}
        {currentScreen === 'profile' && (
          <Profile user={user!} onLogout={handleLogout} />
        )}
      </div>

      <FloatingChatbot />

      {/* Navigation */}
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}
