"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { useAuth } from "./useAuth";
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
        throw new Error(response.message || t.common.error);
      }

      if (response.status === "success") {
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      setError(
        err instanceof Error && err.message ? err.message : t.common.error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, t]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UpdateProfileResult> => {
      if (!token) {
        const message = t.common.error;
        setError(message);
        return { success: false, message };
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
          throw new Error(response.message || t.common.error);
        }

        if (response.status === "success") {
          setProfile(response.data);
          return {
            success: true,
            message: t.settings.profileSaved,
          };
        }

        const message = t.common.error;
        setError(message);
        return { success: false, message };
      } catch (err) {
        const message =
          err instanceof Error && err.message ? err.message : t.common.error;
        setError(message);
        console.error("Error updating profile", err);
        return { success: false, message };
      } finally {
        setIsSaving(false);
      }
    },
    [token, t],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

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
