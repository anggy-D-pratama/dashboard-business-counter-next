"use client";

import "./page.css";
import "../page.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RecommendedModel {
  name: string;
  description: string;
}

export default function OnboardingSummary() {
  const router = useRouter();
  const [modelData, setModelData] = useState<RecommendedModel | null>(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("rec-model");
    if (savedData) {
      setModelData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="survey-wrapper">
      <div className="survey-card result-card mx-auto my-8">
        <div className="result-header">
          <div className="success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2>Analisis Selesai!</h2>
          <p>
            Berdasarkan jawaban Anda, kami telah menyiapkan konfigurasi dasbor
            yang paling optimal.
          </p>
        </div>

        <div className="result-content">
          <p className="result-label">Model Bisnis yang Direkomendasikan</p>

          <div className="model-highlight-card">
            <h3>{modelData?.name || "Memuat..."}</h3>
            <p>{modelData?.description || "Memuat deskripsi..."}</p>
          </div>
        </div>

        <div className="survey-footer result-footer">
          <button
            className="btn-next btn-full"
            onClick={() => {
              router.push("/");
            }}
          >
            Mulai Gunakan Dasbor
          </button>
        </div>
      </div>
    </div>
  );
}
