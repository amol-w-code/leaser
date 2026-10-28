"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getMultiFactorResolver, TotpMultiFactorGenerator } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c4.5-2.7 8-6.4 8-10.7A5.3 5.3 0 0014.7 5c-1.1 0-2.1.4-2.9 1.1L12 6.5l-.2-.4A5.3 5.3 0 004.7 5 5.3 5.3 0 004 10.3C4 14.6 7.5 18.3 12 21z" />
      </svg>
    ),
    title: "Smart Budgets",
    desc: "Track spending across categories with visual insights",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    ),
    title: "AI Advisor",
    desc: "Get personalized financial advice powered by Gemini",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Works Everywhere",
    desc: "Beautiful on desktop, tablet, and mobile devices",
  },
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoadingAction(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
      } else {
        setError(err.message || "An error occurred during Google sign in.");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleVerify2FA = async (e: FormEvent) => {
    e.preventDefault();
    if (!mfaResolver) return;
    setError("");
    setLoadingAction(true);
    try {
      const mfaHint = mfaResolver.hints[0];
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(mfaHint.uid, verificationCode);
      await mfaResolver.resolveSignIn(assertion);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoadingAction(false);
    }
  };

  // ── MFA Screen ──
  if (mfaResolver) {
    return (
      <div className="login-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-1 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-brand/30 to-purple-400/20 blur-3xl" />
          <div className="float-2 absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/25 to-indigo-400/15 blur-3xl" />
          <div className="float-3 absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-violet-300/20 to-brand/10 blur-3xl" />
        </div>

        <div className="relative z-10 mb-8 flex items-center gap-3 fade-in-up">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-2xl font-semibold text-ink">Leaser</span>
        </div>

        <div className="glass-card relative z-10 w-full max-w-md rounded-[24px] p-8 shadow-xl slide-up">
           <h1 className="font-display text-2xl font-semibold text-ink text-center mb-2">Two-Factor Verification</h1>
           <p className="text-ink-soft mb-6 text-center text-sm">Enter the 6-digit code from your authenticator app.</p>

           <form onSubmit={handleVerify2FA} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-ink">Verification Code</span>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="mt-1.5 w-full rounded-[14px] border border-border bg-white/50 px-3.5 py-3 text-ink text-center tracking-widest font-mono text-lg transition-all focus:border-brand focus:bg-white focus:shadow-sm focus:outline-none"
                  placeholder="000000"
                />
              </label>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200/60 px-3 py-2.5 text-sm text-negative fade-in-up">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingAction || verificationCode.length !== 6}
                className="btn-press w-full bg-gradient-to-r from-brand to-purple-600 text-white rounded-[14px] py-3.5 px-4 font-medium hover:shadow-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand mt-4 disabled:opacity-60"
              >
                {loadingAction ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white spin-slow" />
                    Verifying…
                  </span>
                ) : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => { setMfaResolver(null); setVerificationCode(""); setError(""); }}
                className="w-full text-center text-sm text-ink-soft hover:text-ink mt-4 font-medium transition-colors"
              >
                Back to Sign In
              </button>
           </form>
        </div>
      </div>
    );
  }

  // ── Loading/redirect ──
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="loading-spinner" />
          <span className="text-sm text-ink-faint fade-in-up">Loading…</span>
        </div>
      </div>
    );
  }

  // ── Main Login Page ──
  return (
    <div className="login-bg min-h-screen flex">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="float-1 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-brand/25 to-purple-400/15 blur-3xl" />
        <div className="float-2 absolute top-1/3 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/10 blur-3xl" />
        <div className="float-3 absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-violet-300/15 to-brand/10 blur-3xl" />
      </div>

      {/* Left: Feature Showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-10 fade-in-up">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-3xl font-semibold text-ink">Leaser</span>
          </div>

          <h2 className="font-display text-4xl font-semibold text-ink leading-tight mb-3 fade-in-up" style={{ animationDelay: "100ms" }}>
            Your finances,<br />
            <span className="gradient-text">beautifully managed.</span>
          </h2>
          <p className="text-ink-soft text-lg mb-10 fade-in-up leading-relaxed" style={{ animationDelay: "150ms" }}>
            Track budgets, manage expenses, and get AI-powered insights — all in one beautiful app.
          </p>

          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="fade-in-up flex items-start gap-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-white/70"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  {f.icon}
                </span>
                <div>
                  <p className="font-semibold text-ink text-sm">{f.title}</p>
                  <p className="text-ink-soft text-sm mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-3 fade-in-up">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-2xl font-semibold text-ink">Leaser</span>
        </div>

        <div className="glass-card w-full max-w-[420px] rounded-[24px] p-8 sm:p-10 shadow-xl slide-up">
          <div className="text-center mb-8">
            <h1 className="font-display text-[1.7rem] font-semibold text-ink leading-tight">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-ink-soft mt-2.5 text-sm">
              {isSignUp ? "Start tracking your finances today" : "Sign in to manage your money"}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loadingAction}
            className="btn-press w-full flex items-center justify-center gap-3 bg-white text-ink border border-border rounded-[14px] py-3 px-4 font-medium hover:bg-surface hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center py-1.5 mb-6">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-ink-faint text-xs font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-[14px] border border-border bg-white/50 px-4 py-3 text-ink transition-all focus:border-brand focus:bg-white focus:shadow-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-[14px] border border-border bg-white/50 px-4 py-3 text-ink transition-all focus:border-brand focus:bg-white focus:shadow-sm focus:outline-none"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200/60 px-3 py-2.5 text-sm text-negative fade-in-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingAction}
              className="btn-press w-full bg-gradient-to-r from-brand to-purple-600 text-white rounded-[14px] py-3.5 px-4 font-semibold hover:shadow-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand mt-2 disabled:opacity-60"
            >
              {loadingAction ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white spin-slow" />
                  Processing…
                </span>
              ) : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-ink-soft">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-brand font-semibold hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-faint/70 fade-in-up stagger-3 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
          Your data stays in your browser. No tracking.
        </p>
      </div>
    </div>
  );
}
