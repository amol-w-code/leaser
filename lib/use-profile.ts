"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "./types";
import { useAuth } from "./auth-context";
import { subscribeProfile, saveProfileToFirestore } from "./firestore-storage";

function defaultProfile(): UserProfile {
  return {
    fullName: "",
    email: "",
    bio: "Budgeting with calm confidence.",
    theme: "light",
    country: "India",
    currency: "INR",
    profileImage: "",
  };
}

export function useProfile() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [profile, setProfile] = useState<UserProfile>(defaultProfile());
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!uid || !user) {
      setProfile(defaultProfile());
      setLoaded(false);
      return;
    }

    const unsub = subscribeProfile(uid, (firestoreProfile) => {
      if (firestoreProfile) {
        setProfile(firestoreProfile);
      } else {
        // First time: auto-populate from Firebase Auth
        const initial: UserProfile = {
          ...defaultProfile(),
          fullName: user.displayName || "",
          email: user.email || "",
          profileImage: user.photoURL || "",
        };
        setProfile(initial);
        // Save to Firestore so it persists
        saveProfileToFirestore(uid, initial);
      }
      setLoaded(true);
    });

    return () => unsub();
  }, [uid, user]);

  async function saveProfile(updated: UserProfile) {
    if (!uid) return;
    setSaving(true);
    setProfile(updated);
    await saveProfileToFirestore(uid, updated);
    window.dispatchEvent(new Event("profile-updated"));
    setSaving(false);
  }

  return { profile, loaded, saving, saveProfile };
}
