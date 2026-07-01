import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, BookOpen } from "lucide-react";
// import { loginUser } from "../../Redux/slices/authSlice"; // adjust to your actual login thunk

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // await dispatch(loginUser({ email, password })).unwrap();
      // navigate("/");
    } catch (err) {
      setErrors({ form: err?.message || "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 signin-bg relative overflow-hidden">
      {/* Floating background blobs */}
      <div className="signin-blob signin-blob-1" />
      <div className="signin-blob signin-blob-2" />

      <div className="w-full max-w-md relative z-10 signin-card">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8 signin-header">
          <div className="w-14 h-14 rounded-2xl bg-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-200 signin-logo">
            <BookOpen size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/50 p-8 signin-form-card">
          {errors.form && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm signin-error">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100"}`}>
                <Mail size={18} className={errors.email ? "text-red-400" : "text-gray-400"} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-purple-700 hover:text-purple-800">
                  Forgot password?
                </Link>
              </div>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100"}`}>
                <Lock size={18} className={errors.password ? "text-red-400" : "text-gray-400"} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-purple-700 transition-colors duration-150 shrink-0"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-700 font-semibold hover:text-purple-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes signinFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .signin-header {
          animation: signinFadeUp 0.5s ease-out both;
        }
        .signin-logo {
          animation: signinFadeUp 0.5s ease-out 0.05s both;
        }
        .signin-form-card {
          animation: signinFadeUp 0.6s ease-out 0.15s both;
        }
        .signin-error {
          animation: signinFadeUp 0.3s ease-out both;
        }

        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 25px) scale(1.08); }
        }
        .signin-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          pointer-events: none;
        }
        .signin-blob-1 {
          top: -10%;
          right: -5%;
          width: 320px;
          height: 320px;
          background: #a78bfa;
          animation: blobFloat1 9s ease-in-out infinite;
        }
        .signin-blob-2 {
          bottom: -10%;
          left: -5%;
          width: 280px;
          height: 280px;
          background: #818cf8;
          animation: blobFloat2 11s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}