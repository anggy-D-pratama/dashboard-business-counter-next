"use client";

import { useCallback, useEffect, useState } from "react";
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
        throw new Error(response.message || "Failed to fetch profile");
      }

      if (response.status === "success") {
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to fetch profile",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UpdateProfileResult> => {
      if (!token) {
        return { success: false, message: "Not authenticated" };
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
          throw new Error(response.message || "Failed to update profile");
        }

        if (response.status === "success") {
          setProfile(response.data);
          return {
            success: true,
            message: response.message || "Profile updated successfully",
          };
        }

        return { success: false, message: "Failed to update profile" };
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Failed to update profile";
        setError(message);
        console.error("Error updating profile", err);
        return { success: false, message };
      } finally {
        setIsSaving(false);
      }
    },
    [token],
  );

  useEffect(() => {
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
