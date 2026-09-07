import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Users, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, resetPassword, switchDemoUser, isSupabaseActive } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Registration state
  const [regUsername, setRegUsername] = useState<string>('');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regGender, setRegGender] = useState<string>('Male');
  const [regAge, setRegAge] = useState<string>('21');
  const [regMobile, setRegMobile] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!regUsername.trim() || regUsername.length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const ageNum = parseInt(regAge, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      setErrorMessage('Please enter a valid age between 10 and 100.');
      return;
    }
    const cleanMobile = regMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      username: regUsername.trim(),
      fullName: regFullName.trim(),
      gender: regGender,
      age: ageNum,
      mobileNumber: `+91 ${cleanMobile.slice(-10)}`,
      email: regEmail.trim(),
      password: regPassword,
    });
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Registration failed. Please check inputs.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(forgotEmail);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Password reset link has been dispatched.');
    } else {
      setErrorMessage(res.error || 'Failed to request password reset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#070714] text-slate-200 rounded-3xl max-w-lg w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl">
        {/* Top Header */}
        <div className="bg-[#0a0a1f] p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-widest">
                Vikash Library Portal
              </span>
            </div>
            <h3 className="font-black text-xl text-white mt-1 font-sans">
              {mode === 'login' && 'Student & Admin Login'}
              {mode === 'register' && 'Create Student Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#030308] px-6 pt-3 font-mono">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register (New Student)
          </button>
          <button
            onClick={() => {
              setMode('forgot');
              setErrorMessage(null);
            }}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              mode === 'forgot'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Quick Demo Login Bar for Testing */}
        <div className="bg-cyan-950/30 border-b border-cyan-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Demo:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                switchDemoUser('student');
                onClose();
              }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-white/10 text-[11px] transition-colors cursor-pointer"
            >
              Demo Student
            </button>
            <button
              onClick={() => {
                switchDemoUser('admin');
                onClose();
              }}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[11px] transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Notifications */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-3 rounded-2xl flex items-start gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl flex items-start gap-2 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-mono font-bold text-slate-300 mb-1.5 text-xs uppercase tracking-wider">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. rohit.paswan@gmail.com or rohitpaswan"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-mono font-bold text-slate-300 text-xs uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-98 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Verifying Account...' : 'Sign In to Vikash Library'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Username */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Username <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rohit_study"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Paswan"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Gender */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Gender <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#0a0a1f] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60 font-sans"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Age <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="100"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60 font-mono"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                  Mobile Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="7541053789"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full pl-14 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60 font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                  Gmail / Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Password <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-mono font-bold text-slate-300 mb-1 text-xs uppercase tracking-wider">
                    Confirm Password <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-98 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                Enter the email address registered with Vikash Library. We will send you instructions to reset your password.
              </p>
              <div>
                <label className="block font-mono font-bold text-slate-300 mb-1.5 text-xs uppercase tracking-wider">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending Request...' : 'Send Reset Link'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

