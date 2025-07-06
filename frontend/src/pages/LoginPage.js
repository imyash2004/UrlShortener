import React, { useState, useEffect, useContext } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import organizationService from "../services/organizationService";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Generate animated particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed", error);
      setMessage(
        error.message || "Login failed. Please check your credentials."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-animate {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div
        className="min-h-screen bg-black overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              animation: "grid-move 15s linear infinite",
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-cyan-400 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity * 0.8,
                boxShadow: `0 0 ${particle.size * 3}px rgba(0, 255, 255, 0.8)`,
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-32 h-32 bg-cyan-500 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-10 w-36 h-36 bg-pink-500 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>

        {/* Neural Network Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          style={{ zIndex: 1 }}
        >
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00ffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#0080ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M 100 100 Q 200 150 300 100 T 500 120 T 700 100"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M 150 200 Q 250 250 350 200 T 550 220 T 750 200"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <path
            d="M 80 300 Q 180 350 280 300 T 480 320 T 680 300"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>

        {/* Main Form Container */}
        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mb-4 shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-800/50">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Message Display */}
              {message && (
                <div
                  className={`message-animate p-4 rounded-xl flex items-center space-x-2 ${
                    messageType === "success"
                      ? "bg-green-500/20 border border-green-500/50 text-green-400"
                      : "bg-red-500/20 border border-red-500/50 text-red-400"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-cyan-400/50 transition-all duration-300">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-cyan-400/50 transition-all duration-300">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-cyan-400 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl py-4 px-6 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white font-semibold">
                        Signing In...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-semibold text-lg">
                        Sign In
                      </span>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-gray-700/50">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Graphics */}
          <div className="text-center mt-8 opacity-60">
            <div className="flex justify-center items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
