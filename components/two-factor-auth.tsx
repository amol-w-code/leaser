"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { multiFactor, TotpMultiFactorGenerator } from "firebase/auth";
import { QRCodeSVG } from 'qrcode.react';

export function TwoFactorAuth() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totpSecret, setTotpSecret] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (user) {
      user.reload().then(() => {
        const enrolled = multiFactor(user).enrolledFactors;
        const isEnrolled = enrolled && enrolled.length > 0;
        setEnrolled(isEnrolled);
      }).catch(() => {
        const enrolled = multiFactor(user).enrolledFactors;
        const isEnrolled = enrolled && enrolled.length > 0;
        setEnrolled(isEnrolled);
      });
    }
  }, [user]);

  const handleEnable2FA = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const multiFactorSession = await multiFactor(user).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
      setTotpSecret(secret);
      setQrUrl(secret.generateQrCodeUrl(user.email || "User", "Leaser"));
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setError("You need to log in again to enable 2FA.");
      } else {
        setError(err.message || "Failed to initiate 2FA setup.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!user || !totpSecret) return;
    setLoading(true);
    setError("");
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, verificationCode);
      await multiFactor(user).enroll(assertion, "Google Authenticator");
      setEnrolled(true);
      setTotpSecret(null);
      setQrUrl("");
      setVerificationCode("");
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const enrolledFactors = multiFactor(user).enrolledFactors;
      if (enrolledFactors && enrolledFactors.length > 0) {
        await multiFactor(user).unenroll(enrolledFactors[0].uid);
        setEnrolled(false);
      }
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setError("You need to log in again to disable 2FA.");
      } else {
        setError(err.message || "Failed to disable 2FA.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="rounded-card border border-border bg-white p-6 shadow-card mt-6">
      <h2 className="text-xl font-semibold text-ink mb-2">Two-Factor Authentication (2FA)</h2>
      <p className="text-sm text-ink-soft mb-4">
        Protect your account with an extra layer of security using Google Authenticator or any TOTP app.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-negative">
          {error}
        </div>
      )}

      {enrolled ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-positive">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">2FA is enabled via Google Authenticator</span>
          </div>
          <button
            onClick={handleDisable2FA}
            disabled={loading}
            className="rounded-xl border border-negative text-negative px-4 py-2 text-sm font-semibold transition-colors hover:bg-negative/5 disabled:opacity-50"
          >
            Disable 2FA
          </button>
        </div>
      ) : totpSecret ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-ink">1. Scan this QR code with your authenticator app</p>
          <div className="bg-white p-4 inline-block rounded-xl border border-border">
            <QRCodeSVG value={qrUrl} size={150} />
          </div>
          <p className="text-sm text-ink-soft">
            Secret Key: <span className="font-mono text-ink bg-surface px-1 py-0.5 rounded">{totpSecret.secretKey}</span>
          </p>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-ink">2. Enter the 6-digit code from the app</label>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-ink text-center tracking-widest font-mono"
                placeholder="000000"
              />
              <button
                onClick={handleConfirm2FA}
                disabled={loading || verificationCode.length !== 6}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
          <button
            onClick={() => { setTotpSecret(null); setError(""); }}
            className="text-sm text-ink-soft hover:text-ink mt-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEnable2FA}
          disabled={loading}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-soft disabled:opacity-50"
        >
          Enable 2FA
        </button>
      )}
    </div>
  );
}
