import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ParticlesBackground } from '../components/ParticlesBackground';

export function EmailVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const email = location.state?.email || '';

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(c => c - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    const checkVerification = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          navigate('/login');
        }
      }
    }, 3000);

    return () => clearInterval(checkVerification);
  }, [navigate]);

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setCountdown(60);
        alert('Verification email has been resent.');
      } else {
        alert('Unable to resend verification email. Please try signing up again.');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="relative z-10 max-w-md w-full bg-card rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
            <span className="text-4xl text-primary-foreground">✓</span>
          </div>
          
          <h1 className="text-2xl font-bold">Email Verification</h1>
          
          <p className="text-muted-foreground text-center mt-4">
            We've sent a verification link to {email}. Please check your email and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center mt-6">
            <span className="text-muted-foreground">Didn't receive the email? </span>
            <button
              onClick={handleResendCode}
              disabled={countdown > 0}
              className={`text-primary font-semibold hover:text-primary/80 ${
                countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}