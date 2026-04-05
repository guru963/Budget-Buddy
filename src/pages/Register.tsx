import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, User, Check } from "lucide-react";
import Logo from "../assets/logo.png";
import { useApp } from "../context/AppContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      login();
      navigate("/");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-bg">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary-light/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-4 relative z-10 animate-in">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/80 p-2 flex items-center justify-center shadow-md mb-3 transition-transform hover:scale-105 duration-300 overflow-hidden">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Budget<span className="text-primary">Buddy</span>
          </h1>
          <p className="text-text-secondary mt-1 text-xs font-medium text-center">Start your journey today!</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-primary/5 border border-white/50 backdrop-blur-sm">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-bold text-text-secondary uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 py-1">
              <div className="w-4 h-4 rounded-md border-2 border-primary/20 flex items-center justify-center bg-primary/5 text-primary">
                <Check size={10} strokeWidth={4} />
              </div>
              <span className="text-[10px] text-text-secondary font-medium">I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms</a></span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <LogIn size={16} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>



          {/* Login Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-text-secondary font-medium">
              Have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}
