"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "../config";
import { useAuth } from "./useAuth";

interface BusinessModelQuestions {
  id: string;
  question_text: string;
  sort_order: number;
  is_active: boolean;
  options: Option[];
}

interface Option {
  scores: [];
  text: string;
  value: string;
}

interface BusinessModelAnswers {
  question_id: string;
  value: string;
}

interface BusinessModels {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  category: string;
}

export function useBusinessModel() {
  const router = useRouter();

  const { token, user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [businessModelQuestions, setBusinessModelQuestions] = useState<
    BusinessModelQuestions[]
  >([]);

  const [businessModels, setBusinessModels] = useState<BusinessModels[]>([]);
  const [businessModel, setBusinessModel] = useState<BusinessModels | null>(
    null,
  );

  const question = useCallback(async () => {
    if (!token) return;

    try {
      const req = await fetch(`${config.apiUrl}/business-model/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.message || "Failed to fetch questions");
      }
      if (res.status === "success") {
        setBusinessModelQuestions(res.data);
      }
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  }, [token]);

  const assess = async (payload: BusinessModelAnswers[]) => {
    if (!token) return;

    try {
      const req = await fetch(`${config.apiUrl}/business-model/assess`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: payload,
        }),
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.message || "Failed to submit answers");
      }

      if (res.status === "success" && user) {
        setUser({
          ...user,
          business_model_id: res?.data?.recommended_model?.id,
        });
        sessionStorage.setItem(
          "rec-model",
          JSON.stringify(res.data.recommended_model),
        );
        router.push("/onboarding/summary");
      }
    } catch (err) {
      console.error("Error proceed answer", err);
    }
  };

  const getAllModel = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const req = await fetch(`${config.apiUrl}/business-models`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.message || "Failed fetch models");
      }

      if (res.status === "success") {
        setBusinessModels(res.data);
      }
    } catch (err) {
      console.log("error fetch models", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getCurrentModel = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const req = await fetch(`${config.apiUrl}/business-model/current`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.message || "failed to fetch current model");
      }

      if (res.status === "success") {
        setBusinessModel(res.data);
      }
    } catch (err) {
      console.error("error fetch model", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const upsertModel = useCallback(
    async (business_model_id: string) => {
      if (!token) return;
      try {
        setIsLoading(true);
        const req = await fetch(`${config.apiUrl}/business-model/current`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_model_id,
          }),
        });

        const res = await req.json();

        if (!req.ok) {
          throw new Error(res.message || "failed to upsert model data");
        }

        if (res.status === "success" && user) {
          setUser({
            ...user,
            business_model_id: res?.data?.id,
          });
          sessionStorage.setItem("rec-model", JSON.stringify(res.data));
          setBusinessModel(res.data);
        }
      } catch (err) {
        console.log("error upsert model", err);
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  return {
    isLoading,
    businessModelQuestions,
    businessModels,
    businessModel,
    question,
    assess,
    getAllModel,
    getCurrentModel,
    upsertModel,
  };
}
