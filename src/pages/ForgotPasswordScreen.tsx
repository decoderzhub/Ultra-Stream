import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="relative z-10 max-w-md w-full bg-card rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <LogoPlaceholder />
          <h1 className="text-2xl font-bold mt-6">Reset Password</h1>
          <p className="text-muted-foreground text-center mt-2">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
              <p>Password reset email sent!</p>
              <p className="text-sm mt-2">
                Please check your email for instructions to reset your password.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              type="email"
            />
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <Button
              onClick={handleResetPassword}
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-semibold hover:text-primary/80"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}