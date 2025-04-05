import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User, Shield, Bell, Globe, Moon, Sun, Wifi, WifiOff, Lock, Eye, Volume2, Check, X } from 'lucide-react';
import { auth } from '../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [vpnEnabled, setVpnEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [language, setLanguage] = useState('English');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (name: string) => (value: string) => {
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
    
    if (name === 'newPassword') {
      checkPasswordRequirements(value);
    }
  };

  const allRequirementsMet = () => {
    return Object.values(passwordRequirements).every(requirement => requirement);
  };

  const passwordsMatch = () => {
    return passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '';
  };

  const handleChangePassword = async () => {
    if (!auth.currentUser?.email) return;
    
    if (!allRequirementsMet()) {
      setError('Please meet all password requirements');
      return;
    }
    
    if (!passwordsMatch()) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordData.newPassword);
      
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const RequirementCheck = ({ met }: { met: boolean }) => (
    met ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Settings</h1>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="pt-16 px-4 max-w-2xl mx-auto">
        {/* Settings Sections */}
        <div className="space-y-6 py-6">
          {/* Account Settings */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-primary" />
                  <span>Privacy Mode</span>
                </div>
                <ToggleSwitch enabled={true} onChange={() => {}} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-primary" />
                  <span>VPN Protection</span>
                </div>
                <ToggleSwitch enabled={vpnEnabled} onChange={() => setVpnEnabled(!vpnEnabled)} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-primary" />
                  <span>Notifications</span>
                </div>
                <ToggleSwitch enabled={notifications} onChange={() => setNotifications(!notifications)} />
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-primary font-semibold hover:text-primary/80 flex items-center gap-2"
                >
                  <Lock size={16} />
                  Change Password
                </button>

                {showChangePassword && (
                  <div className="mt-4 space-y-4">
                    <Input
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange('currentPassword')}
                      type="password"
                      placeholder="Enter your current password"
                    />

                    <div className="space-y-2">
                      <Input
                        label="New Password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange('newPassword')}
                        type="password"
                        placeholder="Enter your new password"
                      />
                      
                      <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                        <h3 className="font-semibold">Password Requirements:</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <RequirementCheck met={passwordRequirements.length} />
                            <span>At least 12 characters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RequirementCheck met={passwordRequirements.uppercase} />
                            <span>At least one uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RequirementCheck met={passwordRequirements.lowercase} />
                            <span>At least one lowercase letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RequirementCheck met={passwordRequirements.number} />
                            <span>At least one number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RequirementCheck met={passwordRequirements.special} />
                            <span>At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange('confirmPassword')}
                      type="password"
                      placeholder="Confirm your new password"
                      error={passwordData.confirmPassword && !passwordsMatch() ? "Passwords do not match" : ""}
                    />

                    {error && (
                      <p className="text-destructive text-sm">{error}</p>
                    )}

                    {success && (
                      <p className="text-green-500 text-sm">{success}</p>
                    )}

                    <Button
                      onClick={handleChangePassword}
                      loading={loading}
                      variant="primary"
                      className="w-full"
                      disabled={!allRequirementsMet() || !passwordsMatch()}
                    >
                      Update Password
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon size={20} className="text-primary" />
                  ) : (
                    <Sun size={20} className="text-primary" />
                  )}
                  <span>Dark Mode</span>
                </div>
                <ToggleSwitch enabled={theme === 'dark'} onChange={toggleTheme} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-primary" />
                  <span>Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Playback Settings */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Playback</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-primary" />
                  <span>Video Quality</span>
                </div>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1"
                >
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} className="text-primary" />
                  <span>Autoplay Videos</span>
                </div>
                <ToggleSwitch enabled={autoplay} onChange={() => setAutoplay(!autoplay)} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {vpnEnabled ? (
                    <Wifi size={20} className="text-primary" />
                  ) : (
                    <WifiOff size={20} className="text-primary" />
                  )}
                  <span>Download Quality</span>
                </div>
                <select
                  className="rounded-lg border border-input bg-background px-3 py-1"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}