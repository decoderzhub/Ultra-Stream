import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Check, X } from 'lucide-react';

export function SignUpScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
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

  const handleChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (name === 'password') {
      checkPasswordRequirements(value);
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

  const allRequirementsMet = () => {
    return Object.values(passwordRequirements).every(requirement => requirement);
  };

  const passwordsMatch = () => {
    return formData.password === formData.confirmPassword && formData.password !== '';
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!allRequirementsMet()) {
      setError('Please meet all password requirements');
      return false;
    }
    if (!passwordsMatch()) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      await updateProfile(user, {
        displayName: formData.displayName
      });

      await sendEmailVerification(user);
      
      navigate('/verify-email', { state: { email: formData.email } });
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
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="relative z-10 max-w-md w-full bg-card rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <LogoPlaceholder />
          <h1 className="text-2xl font-bold mt-6">Create Account</h1>
        </div>

        <div className="space-y-4">
          <Input
            label="Display Name"
            value={formData.displayName}
            onChange={handleChange('displayName')}
            placeholder="Enter your name"
            type="text"
          />
          
          <Input
            label="Email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Enter your email"
            type="email"
          />
          
          <div className="space-y-2">
            <Input
              label="Password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              type="password"
            />
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <h3 className="font-semibold">Password Requirements:</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.length} />
                  <span className="text-muted-foreground">At least 12 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.uppercase} />
                  <span className="text-muted-foreground">At least one uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.lowercase} />
                  <span className="text-muted-foreground">At least one lowercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.number} />
                  <span className="text-muted-foreground">At least one number</span>
                </div>
                <div className="flex items-center gap-2">
                  <RequirementCheck met={passwordRequirements.special} />
                  <span className="text-muted-foreground">At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              type="password"
              error={formData.confirmPassword && !passwordsMatch() ? "Passwords do not match" : ""}
            />
            
            {formData.confirmPassword && passwordsMatch() && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <Check className="w-4 h-4" />
                <span>Passwords match</span>
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <Button
            onClick={handleSignUp}
            loading={loading}
            variant="primary"
            className="w-full"
            disabled={!allRequirementsMet() || !passwordsMatch()}
          >
            Sign Up
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}