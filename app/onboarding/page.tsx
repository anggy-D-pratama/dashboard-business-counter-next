"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/hooks/useAuth"; // Update path if needed
import { config } from "../../src/config"; // Update path if needed

// Interfaces for API Responses
interface Option {
  value: string;
  text: string;
}

interface Question {
  id: string;
  question_text: string;
  options: Option[];
}

export default function OnboardingLock() {
  const router = useRouter();

  // Note: Ensure your useAuth hook exports 'setUser' as we discussed!
  const { user, token, setUser } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Questions on Mount
  useEffect(() => {
    if (!token) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/business-model/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (res.ok && result.status === "success") {
          setQuestions(result.data || []);
        } else {
          setError(result.message || "Gagal memuat pertanyaan.");
        }
      } catch (err) {
        setError("Koneksi bermasalah saat memuat pertanyaan.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  // Handle Selection
  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Step Navigation
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit Assessment
  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError(null);

    try {
      // Map dictionary to the array format required by API
      const payloadAnswers = Object.entries(answers).map(
        ([question_id, value]) => ({
          question_id,
          value,
        }),
      );

      const res = await fetch(`${config.apiUrl}/business-model/assess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        const recommendedModel = result.data.recommended_model;

        // Update user cookie cache so middleware knows we are done!
        if (user && setUser) {
          setUser({ ...user, business_model_id: recommendedModel.id });
        }

        // Unlock dashboard
        router.push("/");
      } else {
        setError(result.message || "Gagal menyimpan model bisnis.");
      }
    } catch (err) {
      setError("Koneksi bermasalah saat menyimpan penilaian.");
    } finally {
      setSubmitting(false);
    }
  };

  // UI: Loading State
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-500 font-medium animate-pulse">
          Memuat pertanyaan...
        </div>
      </div>
    );
  }

  // UI: Empty/Error State
  if (questions.length === 0) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="text-red-500 font-medium">
          {error || "Tidak ada pertanyaan tersedia."}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const isLastStep = currentStep === totalSteps - 1;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 fixed inset-0 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
        {/* Header & Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-slate-800">
              <span className="text-blue-600 mr-2">Sisense</span>Analytics
            </h1>
            <span className="text-sm font-medium text-slate-500">
              Pertanyaan {currentStep + 1} dari {totalSteps}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 min-h-[350px]">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Personalisasi Bisnis Anda
          </h2>
          <p className="text-slate-600 font-medium mb-8">
            {currentQuestion.question_text}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    handleOptionSelect(currentQuestion.id, opt.value)
                  }
                  className={`w-full flex items-center p-4 border rounded-xl cursor-pointer transition-all text-left ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-blue-800" : "text-slate-700"}`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0 || submitting}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Kembali
          </button>

          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${
                !currentAnswer
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!currentAnswer || submitting}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center ${
                !currentAnswer || submitting
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {submitting ? "Memproses..." : "Selesai & Akses Dasbor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
