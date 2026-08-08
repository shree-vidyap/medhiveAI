import React, { useState } from 'react';
import { UserRole } from '../types';
import { saveAuthSession, UserProfile } from '../utils/auth';
import { AlertCircle, CheckCircle2, Lock, Mail, ShieldAlert, User, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Error & loading states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmailOrPhone.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API Login
      const mockToken = `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const userObj: UserProfile = {
        id: `usr-${Date.now()}`,
        name: loginEmailOrPhone.includes('@') ? loginEmailOrPhone.split('@')[0] : 'Patient User',
        emailOrPhone: loginEmailOrPhone,
        role: role,
        district: 'Mandya',
        termsAccepted: true,
        onboardingCompleted: true,
      };

      saveAuthSession(mockToken, userObj);
      onAuthSuccess(userObj);
      onClose();
    } catch (err: any) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email address or phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms of Service & Medical Disclaimer to continue.');
      return;
    }

    setLoading(true);
    try {
      const mockToken = `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const userObj: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        emailOrPhone: emailOrPhone.trim(),
        role: role,
        dob: dob || undefined,
        gender: gender,
        district: 'Mandya',
        termsAccepted: true,
        onboardingCompleted: false, // Triggers short onboarding flow
      };

      saveAuthSession(mockToken, userObj);
      onAuthSuccess(userObj);
      onClose();
    } catch (err: any) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-scale-up text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign In to Medihivi AI' : 'Create Your Medihivi Account'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {mode === 'login'
              ? 'Access your health records, AI assessments, and active referrals'
              : 'Join Medihivi AI for instant triage guidance and healthcare referrals'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
              mode === 'login' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
              mode === 'register' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 mb-5 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email or Phone Number</label>
              <input
                type="text"
                value={loginEmailOrPhone}
                onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                placeholder="e.g. +91 98450 12345 or user@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Mode</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none transition"
              >
                <option value="PATIENT">Patient Account</option>
                <option value="HEALTH_WORKER">Health Worker Account</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl shadow-md transition disabled:opacity-50 cursor-pointer text-xs mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basavaraju M"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email or Phone Number *</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. +91 98450 12345 or patient@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              >
                <option value="PATIENT">Patient</option>
                <option value="HEALTH_WORKER">Health Worker</option>
              </select>
            </div>

            {/* MANDATORY MEDICAL DISCLAIMER CHECKBOX */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 font-medium">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-amber-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I accept the Terms of Service & Medical Disclaimer: <br />
                  <strong className="text-amber-900 font-bold">
                    "Medihivi AI provides AI-assisted guidance and is not a substitute for professional medical diagnosis or emergency services."
                  </strong>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl shadow-md transition disabled:opacity-50 cursor-pointer text-xs mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
