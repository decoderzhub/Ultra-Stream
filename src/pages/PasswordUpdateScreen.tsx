import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { Check, X } from 'lucide-react';

export function PasswordUpdateScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordData, setPasswordData] = useState({
    currentPassword: location.state?.currentPassword || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

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

  const handleUpdatePassword = async () => {
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
    
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordData.newPassword);
      
      // Sign out and redirect to login
      await auth.signOut();
      navigate('/login', { 
        state: { 
          message: 'Password updated successfully. Please log in with your new password.' 
        } 
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const RequirementCheck = ({ met }: { met: boolean }) => (
    met ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <LogoPlaceholder />
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Update Your Password</h1>
          <p className="text-gray-600 text-center mt-2">
            Your current password doesn't meet our security requirements. Please update it to continue.
          </p>
        </div>

        <div className="space-y-4">
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
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <h3 className="font-semibold text-gray-700">Password Requirements:</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.length} />
                  <span className="text-gray-600">At least 12 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.uppercase} />
                  <span className="text-gray-600">At least one uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.lowercase} />
                  <span className="text-gray-600">At least one lowercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.number} />
                  <span className="text-gray-600">At least one number</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.special} />
                  <span className="text-gray-600">At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</span>
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
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            onClick={handleUpdatePassword}
            loading={loading}
            variant="primary"
            className="w-full"
            disabled={!allRequirementsMet() || !passwordsMatch()}
          >
            Update Password
          </Button>

          <div className="text-center">
            <button
              onClick={() => {
                auth.signOut();
                navigate('/login');
              }}
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Cancel and Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}