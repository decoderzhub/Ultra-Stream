import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { SignUpScreen } from './pages/SignUpScreen';
import { LoginScreen } from './pages/LoginScreen';
import { EmailVerificationScreen } from './pages/EmailVerificationScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { PasswordUpdateScreen } from './pages/PasswordUpdateScreen';
import { HomeScreen } from './pages/HomeScreen';
import { VideoPlayerScreen } from './pages/VideoPlayerScreen';
import { ShortsScreen } from './pages/ShortsScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { MessagesScreen } from './pages/MessagesScreen';
import { VideoCallScreen } from './pages/VideoCallScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { LibraryScreen } from './pages/LibraryScreen';
import { TrendingScreen } from './pages/TrendingScreen';
import { HistoryScreen } from './pages/HistoryScreen';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/update-password" element={<PasswordUpdateScreen />} />
          <Route path="/verify-email" element={<EmailVerificationScreen />} />
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/video/:videoId" 
            element={
              <PrivateRoute>
                <VideoPlayerScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/shorts" 
            element={
              <PrivateRoute>
                <ShortsScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfileScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <PrivateRoute>
                <MessagesScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/call/:userId" 
            element={
              <PrivateRoute>
                <VideoCallScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <SettingsScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <PrivateRoute>
                <LibraryScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/trending" 
            element={
              <PrivateRoute>
                <TrendingScreen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <PrivateRoute>
                <HistoryScreen />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;