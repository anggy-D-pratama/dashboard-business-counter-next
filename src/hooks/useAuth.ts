"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";
import { config } from "../config";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  api_key: string;
  is_active: boolean;
  business_model_id: string;
}

export function useAuth() {
  const router = useRouter();

  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Load: Load cookies into state on component mount (client-side only)
  useEffect(() => {
    const savedToken = getCookie("auth_token");
    const savedUser = getCookie("auth_user");

    if (savedToken) {
      setTokenState(savedToken);
    }
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user cookie:", e);
      }
    }
  }, []);

  // Wrappers to update state and update the cookies simultaneously
  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) {
      setCookie("auth_token", value);
    } else {
      deleteCookie("auth_token");
    }
  };

  const setUser = (value: User | null) => {
    setUserState(value);
    if (value) {
      setCookie("auth_user", JSON.stringify(value));
    } else {
      deleteCookie("auth_user");
    }
  };

  // Equivalent to computed(() => !!token.value)
  const isAuthenticated = useMemo(() => !!token, [token]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          response.message || "Login failed. Please check your credentials.",
        );
      }

      if (response.status === "success") {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    password_confirmation: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${config.apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          password_confirmation,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Registration failed.");
      }

      if (response.status === "success") {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const changePassword = async (
    current_password: string,
    new_password: string,
    password_confirmation: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${config.apiUrl}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password,
          new_password,
          password_confirmation,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to change password.");
      }

      if (response.status === "success") {
        return { success: true, message: response.message };
      }
    } catch (err: any) {
      const errMsg = err.message || "Failed to change password.";
      setError(errMsg);
      console.error("Change password error:", err);
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
    return { success: false, message: "Unknown error" };
  };

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    changePassword,
    setUser,
  };
}
