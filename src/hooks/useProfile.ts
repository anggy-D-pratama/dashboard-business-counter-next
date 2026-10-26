"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useLocale } from "../contexts/LocaleContext";
import { config } from "../config";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_address: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  business_name: string;
  business_address: string;
}

type UpdateProfileResult = {
  success: boolean;
  message: string;
};

export function useProfile() {
  const { token } = useAuth();
  const { t } = useLocale();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${config.apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      if (!res.ok) {
        console.error("Error fetching profile", response.message);
        setError(t.common.error);
        return;
      }

      if (response.status === "success") {
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      setError(t.common.error);
    } finally {
      setIsLoading(false);
    }
  }, [token, t]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UpdateProfileResult> => {
      if (!token) {
        return { success: false, message: t.common.error };
      }

      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const res = await fetch(`${config.apiUrl}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const response = await res.json();
        if (!res.ok) {
          console.error("Error updating profile", response.message);
          setError(t.common.error);
          return { success: false, message: t.common.error };
        }

        if (response.status === "success") {
          setProfile(response.data);
          return {
            success: true,
            message: t.settings.profileSaved,
          };
        }

        return { success: false, message: t.common.error };
      } catch (err) {
        console.error("Error updating profile", err);
        setError(t.common.error);
        return { success: false, message: t.common.error };
      } finally {
        setIsSaving(false);
      }
    },
    [token, t],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    profile,
    isLoading,
    isSaving,
    error,
    successMessage,
    fetchProfile,
    updateProfile,
    setError,
    setSuccessMessage,
  };
}
