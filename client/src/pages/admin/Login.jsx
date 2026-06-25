import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../../Redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors]     = useState({})
  const [success, setSuccess]   = useState(false)


    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

  const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim()) {
            setErrors((prev) => {
                const { email, ...rest } = prev;
                return rest;
            });
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value.trim()) {
            setErrors((prev) => {
                const { password, ...rest } = prev;
                return rest;
            });
        }
    };

  const handleSubmit = async (ev) => {
      ev.preventDefault();

      const isValid = validateForm();

      if (!isValid) {
          return;
      }

      try {
          setErrors({});
           
          const result = await dispatch(LoginUser({email,password})).unwrap();

          console.log('Login successful:', result);
          setSuccess(true);

          navigate("/admin/dashboard");

      } catch (err) {
          setErrors({
              api: err?.message || 'Invalid email or password'
          });
      }
  };


  /* ── Login screen ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">

      {/* Blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[blobDrift_11s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-orange-300 opacity-30 blur-3xl animate-[blobDrift_14s_ease-in-out_infinite_reverse]" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-200/80 px-9 py-10 animate-[cardRise_0.55s_cubic-bezier(0.22,1,0.36,1)_both]">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-7 animate-[fadeUp_0.5s_0.1s_both]">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-orange-400 inline-block" />
          <span className="font-serif text-lg font-bold text-gray-900 tracking-tight">Acme</span>
        </div>

        <h1 className="font-serif italic text-[2rem] leading-tight font-bold text-gray-900 mb-1 animate-[fadeUp_0.5s_0.18s_both]">
          Welcome back
        </h1>
        <p className="text-sm text-gray-400 mb-7 animate-[fadeUp_0.5s_0.24s_both]">
          Sign in to your account to continue.
        </p>
        <form className="flex flex-col" onSubmit={handleSubmit} noValidate> 
          {/* Email field */}
          <div className="mb-4 animate-[fadeUp_0.5s_0.40s_both]">
            <label htmlFor="email" className="block text-[0.72rem] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder-gray-300 outline-none transition-all duration-200
                  focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                  ${errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password field */}
          <div className="mb-4 animate-[fadeUp_0.5s_0.46s_both]">
            <label htmlFor="password" className="block text-[0.72rem] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-9 pr-10 py-3 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder-gray-300 outline-none transition-all duration-200
                  focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                  ${errors.password ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-violet-400 transition-colors p-0.5"
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6 animate-[fadeUp_0.5s_0.52s_both]">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-500">
              <div
                onClick={() => setRemember(r => !r)}
                className={`w-4 h-4 rounded-[5px] flex items-center justify-center border transition-all duration-200 cursor-pointer
                  ${remember ? 'bg-violet-500 border-violet-500' : 'bg-white border-gray-300'}`}
              >
                {remember && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              Remember me
            </label>
            <a href="#" className="text-sm font-bold text-violet-500 hover:text-violet-700 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-orange-400 text-white text-sm font-bold tracking-wide
              shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 active:scale-[0.98]
              disabled:opacity-70 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 transition-all duration-200
              animate-[fadeUp_0.5s_0.56s_both]"
          >
            {loading ? (
              <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
          </form>

          {/* API error */}
          {errors.api && <p className="mt-4 text-center text-xs text-red-400 animate-[fadeUp_0.5s_0.62s_both]">{errors.api}</p>}
      </div>
    </div>
  )
}

export default Login