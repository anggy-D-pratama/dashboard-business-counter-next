"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

export interface UserCategory {
  id: string;
  user_id: string;
  name: string;
  color?: string | null;
  created_at: string;
  updated_at: string;
}

function jsonHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function useCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${config.apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to fetch categories");
      }

      if (response.status === "success") {
        setCategories(response.data ?? []);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to fetch categories",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createCategory = useCallback(
    async (name: string, color?: string) => {
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${config.apiUrl}/categories`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify({ name, color }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to create category");
      }

      await fetchCategories();
    },
    [token, fetchCategories],
  );

  const renameCategory = useCallback(
    async (id: string, name: string, color?: string) => {
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${config.apiUrl}/categories/${id}`, {
        method: "PUT",
        headers: jsonHeaders(token),
        body: JSON.stringify({ name, color }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to update category");
      }

      await fetchCategories();
    },
    [token, fetchCategories],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${config.apiUrl}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to delete category");
      }

      await fetchCategories();
    },
    [token, fetchCategories],
  );

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    renameCategory,
    deleteCategory,
  };
}
