import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, BookOpen } from "lucide-react";
// import { registerUser } from "../../Redux/slices/authSlice"; // adjust to your actual register thunk

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // await dispatch(registerUser({ name, email, password })).unwrap();
      // navigate("/signin");
    } catch (err) {
      setErrors({ form: err?.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-10 signin-bg relative overflow-hidden">
      {/* Floating background blobs */}
      <div className="signin-blob signin-blob-1" />
      <div className="signin-blob signin-blob-2" />

      <div className="w-full max-w-md relative z-10 signin-card">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8 signin-header">
          <div className="w-14 h-14 rounded-2xl bg-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-200 signin-logo">
            <BookOpen size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us and start exploring books</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/50 p-8 signin-form-card">
          {errors.form && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm signin-error">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100"}`}>
                <User size={18} className={errors.name ? "text-red-400" : "text-gray-400"} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100"}`}>
                <Lock size={18} className={errors.password ? "text-red-400" : "text-gray-400"} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100"}`}>
                <Lock size={18} className={errors.confirmPassword ? "text-red-400" : "text-gray-400"} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-purple-700 transition-colors duration-150 shrink-0"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-purple-700 font-semibold hover:text-purple-800">
              Sign in
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