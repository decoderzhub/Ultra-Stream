import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  const handleChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const checkPasswordComplexity = (password: string) => {
    const requirements = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return Object.values(requirements).every(requirement => requirement);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (!user.emailVerified) {
        setError('Please verify your email before logging in');
        await auth.signOut();
        return;
      }

      // Check password complexity
      if (!checkPasswordComplexity(formData.password)) {
        navigate('/update-password', { 
          state: { currentPassword: formData.password }
        });
        return;
      }

      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="relative z-10 max-w-md w-full bg-card text-card-foreground rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <LogoPlaceholder />
          <h1 className="text-2xl font-bold mt-6">Welcome Back</h1>
        </div>

        <div className="space-y-4">
          {success && (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg">
              {success}
            </div>
          )}

          <Input
            label="Email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Enter your email"
            type="email"
          />
          
          <Input
            label="Password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Enter your password"
            type="password"
          />
          
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/forgot-password', { state: { email: formData.email } })}
              className="text-sm text-primary hover:text-primary/80 font-semibold"
            >
              Forgot Password?
            </button>
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <Button
            onClick={handleLogin}
            loading={loading}
            variant="primary"
            className="w-full"
          >
            Login
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}