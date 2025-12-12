import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';
import rosyLogo from 'figma:asset/Rosy.png';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<'initial' | 'email' | 'verify'>('initial');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGoogleLogin = () => {
    setStep('email');
  };

  const handleSendCode = () => {
    if (!email || !email.includes('@gmail.com')) {
      toast.error('Please enter a valid Gmail address');
      return;
    }

    // Request backend to send verification code via Gmail
    fetch('http://localhost:4000/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok) {
          toast.success(`Verification code sent to ${email}`);
          setStep('verify');
        } else {
          toast.error(d?.error || 'Failed to send code');
        }
      })
      .catch(() => toast.error('Failed to send code'));
  };

  const handleVerifyCode = () => {
    fetch('http://localhost:4000/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.user) {
          toast.success('Logged in successfully! Welcome to Rosy');
          onLogin({ ...d.user, badges: [] });
        } else {
          toast.error(d?.error || 'Invalid code');
        }
      })
      .catch(() => toast.error('Verification failed'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur rounded-3xl shadow-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 relative animate-bounce" style={{ animationDuration: '2s' }}>
            <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Rosy
            <Sparkles className="w-6 h-6" />
          </h1>
          <p className="text-gray-600">Scan. Sort. Deposit. Earn rewards!</p>
        </div>

        {/* Initial Step */}
        {step === 'initial' && (
          <div className="space-y-4">
            <p className="text-center text-gray-700 mb-6">
              Sign in with your Gmail to start collecting points and rewards!
            </p>
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-emerald-400 transition-all rounded-2xl shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Gmail address</label>
              <Input
                type="email"
                placeholder="nama@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl"
              />
            </div>
            <Button
              onClick={handleSendCode}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-lg"
              size="lg"
            >
              Send Verification Code
            </Button>
            <Button
              onClick={() => setStep('initial')}
              variant="ghost"
              className="w-full rounded-2xl"
            >
              Back
            </Button>
          </div>
        )}

        {/* Verification Step */}
        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Verification Code</label>
              <p className="text-gray-600 mb-4">A 6-digit verification code has been sent to {email}</p>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-widest rounded-2xl"
              />
              <p className="text-emerald-600 mt-2 text-center bg-emerald-50 p-3 rounded-2xl">
                Demo note: in local development the code will be sent to your Gmail inbox.
              </p>
            </div>
            <Button
              onClick={handleVerifyCode}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-lg"
              size="lg"
            >
              Verify & Sign In
            </Button>
            <Button
              onClick={() => setStep('email')}
              variant="ghost"
              className="w-full rounded-2xl"
            >
              Back
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>Bersama Rosy, menjaga bumi jadi lebih menyenangkan </p>
        </div>
      </Card>
    </div>
  );
}