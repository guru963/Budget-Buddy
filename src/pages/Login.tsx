import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Logo from "../assets/logo.png";
import { useApp } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setTimeout(() => {
      login();
      navigate("/");
    }, 1500);
  };

  const useDemoAccount = () => {
    setEmail("demo@budgetbuddy.com");
    setPassword("password123");
    setTimeout(() => {
      login();
      navigate("/");
    }, 1000);
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
          <p className="text-text-secondary mt-1 text-sm font-medium">Please enter your details.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-primary/5 border border-white/50 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-4">
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
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-bold text-text-secondary uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </form>


          {/* Demo Link */}
          <div className="mt-3 text-center pt-5 border-t border-gray-50 flex flex-col items-center">
            <p className="text-[12px] font-black text-primary uppercase tracking-[2px] mb-3 animate-pulse">
              Click below to explore right now!
            </p>
            <button
              onClick={useDemoAccount}
              className="w-full py-4 bg-[#7C5CFC] text-white rounded-xl text-[14px] font-black uppercase tracking-[2px] shadow-[0_8px_40px_rgba(124,92,252,0.45)] border-none mb-4 active:scale-95 transition-transform"
              style={{ filter: "brightness(1.1)" }}
            >
              Use Demo Account
            </button>
            <p className="text-xs text-text-secondary font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}
