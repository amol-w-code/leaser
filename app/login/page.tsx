"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getMultiFactorResolver, TotpMultiFactorGenerator } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

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
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-center gap-2 fade-in-up">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-ink text-surface">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                <circle cx="16.5" cy="13" r="1.3" fill="currentColor"/>
              </svg>
            </span>
            <span className="font-display text-xl font-semibold text-ink">Leaser</span>
          </div>

          <div className="rounded-card bg-white border border-border p-8 shadow-card slide-up dark-card">
             <h1 className="font-display text-xl font-semibold text-ink text-center mb-1.5">Two-Factor Verification</h1>
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
                    className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-ink text-center tracking-widest font-mono text-lg transition-all focus:border-ink focus:outline-none"
                    placeholder="000000"
                  />
                </label>

                {error && (
                  <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-negative fade-in-up">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingAction || verificationCode.length !== 6}
                  className="btn-press w-full bg-ink text-surface rounded-md py-2.5 px-4 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ink mt-4 disabled:opacity-60"
                >
                  {loadingAction ? "Verifying..." : "Verify Code"}
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
      </div>
    );
  }

  // ── Loading/redirect ──
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="loading-spinner" />
      </div>
    );
  }

  // ── Main Login Page ──
  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 fade-in-up">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-ink text-surface">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              <circle cx="16.5" cy="13" r="1.3" fill="currentColor"/>
            </svg>
          </span>
          <span className="font-display text-xl font-semibold text-ink">Leaser</span>
        </div>

        {/* Card */}
        <div className="rounded-card bg-white border border-border p-8 shadow-card slide-up dark-card">
          <div className="text-center mb-8">
            <h1 className="font-display text-xl font-semibold text-ink">
              {isSignUp ? "Create your account" : "Sign in to Leaser"}
            </h1>
            <p className="text-ink-soft mt-1.5 text-sm">
              {isSignUp ? "Start managing your finances" : "Welcome back. Please enter your details."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink transition-all focus:border-ink focus:outline-none"
                placeholder="me@example.com"
              />
            </label>
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Password</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink transition-all focus:border-ink focus:outline-none"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-negative fade-in-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingAction}
              className="btn-press w-full bg-ink text-surface rounded-md py-2.5 px-4 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ink mt-2 disabled:opacity-60"
            >
              {loadingAction ? "Processing..." : isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <div className="relative flex items-center py-4 my-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-ink-faint text-xs">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loadingAction}
            className="btn-press w-full flex items-center justify-center gap-2 bg-white text-ink border border-border rounded-md py-2 px-4 text-sm font-medium hover:bg-surface transition-all focus:outline-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-ink-soft slide-up stagger-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-ink font-medium hover:underline focus:outline-none"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>

      </div>
    </div>
  );
}
