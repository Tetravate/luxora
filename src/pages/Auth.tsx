import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser, registerUser, addToast, registeredUsers } = useStore();
  
  const isRegisterInitial = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get intended destination from location state, or default
  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email.trim().toLowerCase();
    
    if (!finalEmail || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setIsProcessing(true);
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const passwordHash = btoa(password);

    if (isRegister) {
      // Validate unique email
      if (registeredUsers.some(u => u.email.toLowerCase() === finalEmail)) {
        addToast('This email is already registered', 'error');
        setIsProcessing(false);
        return;
      }

      const finalName = name.trim() || 'New User';
      const role = 'customer';

      const newUser = {
        id: `user-${Date.now()}`,
        name: finalName,
        email: finalEmail,
        phone: '',
        role: role as 'customer' | 'admin',
        isLoggedIn: false,
        passwordHash
      };

      registerUser(newUser);
      addToast('Registration successful! Please sign in.', 'success');
      setIsRegister(false);
      setPassword('');
      setIsProcessing(false);
    } else {
      // Login flow
      const result = loginUser(finalEmail, passwordHash);
      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(from || '/account');
        }
      } else {
        addToast(result.message || 'Invalid email or password', 'error');
        setIsProcessing(false);
      }
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@tetravate.com');
      setPassword('admin123');
    } else {
      setEmail('customer@tetravate.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="py-16 bg-[#F7F5F1] min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-[#E7E3DC] shadow-xl max-w-md w-full p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-serif font-bold text-[#111111] inline-block mb-3">
            TETRAVATE
          </Link>
          <h1 className="text-xl font-serif font-bold text-[#111111]">
            {isRegister ? 'Create Your Account' : 'Welcome to Tetravate'}
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            {isRegister 
              ? 'Join our platform for a seamless shopping experience.'
              : 'Sign in to access your account.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F7F5F1] rounded-2xl p-1 mb-6 border border-[#E7E3DC]">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isRegister ? 'bg-white text-[#111111] shadow-xs' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              isRegister ? 'bg-white text-[#111111] shadow-xs' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  required={isRegister}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#111111]">Password</label>
              {!isRegister && (
                <button type="button" className="text-[11px] text-[#777777] hover:text-[#111111] underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 mt-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isProcessing ? 'Processing...' : (isRegister ? 'Complete Registration' : 'Sign In')}</span>
            {!isProcessing && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Demo One-Click Sign In */}
        <div className="mt-6 pt-6 border-t border-[#E7E3DC] flex flex-col gap-2">
          <p className="text-center text-[11px] text-[#777777] font-medium uppercase tracking-widest mb-1">Demo Credentials</p>
          <button
            type="button"
            onClick={() => handleDemoLogin('customer')}
            className="w-full py-2.5 bg-[#F7F5F1] hover:bg-[#E7E3DC] border border-[#E7E3DC] text-[#111111] text-xs font-semibold rounded-xl transition-colors"
          >
            Fill Customer Credentials
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="w-full py-2.5 bg-[#F7F5F1] hover:bg-[#E7E3DC] border border-[#E7E3DC] text-[#111111] text-xs font-semibold rounded-xl transition-colors"
          >
            Fill Admin Credentials
          </button>
        </div>

      </div>
    </div>
  );
}
