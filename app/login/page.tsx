"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

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
      setError(err.message || "An error occurred during authentication.");
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
      setError(err.message || "An error occurred during Google sign in.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="login-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="float-1 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-brand/30 to-purple-400/20 blur-3xl" />
        <div className="float-2 absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/25 to-indigo-400/15 blur-3xl" />
        <div className="float-3 absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-violet-300/20 to-brand/10 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8 flex items-center gap-3 fade-in-up">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-purple-600 text-white shadow-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
          </svg>
        </span>
        <span className="font-display text-2xl font-semibold text-ink">Leaser</span>
      </div>

      {/* Card */}
      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 shadow-xl slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-ink-soft mt-2 text-sm">
            {isSignUp ? "Start tracking your finances today" : "Sign in to manage your money"}
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loadingAction}
          className="btn-press w-full flex items-center justify-center gap-3 bg-white text-ink border border-border rounded-xl py-3 px-4 font-medium hover:bg-surface hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-ink-faint text-sm">or</span>
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
              className="mt-1.5 w-full rounded-xl border border-border bg-white/50 px-3.5 py-2.5 text-ink transition-all focus:border-brand focus:bg-white focus:shadow-sm focus:outline-none"
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
              className="mt-1.5 w-full rounded-xl border border-border bg-white/50 px-3.5 py-2.5 text-ink transition-all focus:border-brand focus:bg-white focus:shadow-sm focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-negative fade-in-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingAction}
            className="btn-press w-full bg-gradient-to-r from-brand to-purple-600 text-white rounded-xl py-3 px-4 font-medium hover:shadow-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand mt-4 disabled:opacity-60"
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
            className="text-brand font-medium hover:underline focus:outline-none"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>

      <p className="relative z-10 mt-6 text-xs text-ink-faint/80 fade-in-up stagger-3">
        Your data stays in your browser. No tracking.
      </p>
    </div>
  );
}
