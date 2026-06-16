"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import { useAuth } from "@/src/hooks/useAuth";
import { useBusinessModel } from "@/src/hooks/useBusinessModel";

interface Scores {
  retail: number;
  e_commerce: number;
  fnb: number;
  service: number;
  manufacturing: number;
}

export default function OnboardingSurvey() {
  const { logout } = useAuth();
  const { question, assess, businessModelQuestions } = useBusinessModel();

  useEffect(() => {
    question();
  }, [question]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalSteps = businessModelQuestions.length;

  const handleSelect = (value: string) => {
    const question_id = businessModelQuestions[step].id;
    setAnswers((prev) => ({
      ...prev,
      [question_id]: value,
    }));
  };

  const handleNext = () => {
    console.log(step, totalSteps - 1);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      if (businessModelQuestions.length === Object.keys(answers).length) {
        const payloadAnswers = Object.entries(answers).map(
          ([question_id, value]) => ({
            question_id,
            value,
          }),
        );

        assess(payloadAnswers);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (businessModelQuestions.length === 0) {
    return (
      <div className="survey-wrapper">
        <div className="text-slate-500 font-medium">Memuat pertanyaan...</div>
      </div>
    );
  }
  const selectedOption = answers[businessModelQuestions[step].id];
  return (
    <div className="survey-wrapper">
      <div className="survey-card">
        <div className="survey-header">
          <div className="flex items-center justify-center h-16 w-48 overflow-hidden -ml-4">
            <img 
              src="/logo.png" 
              alt="NotaKita Logo" 
              className="w-full h-full object-cover object-center" 
            />
          </div>
          <div className="progress-container">
            <span className="progress-text">
              Langkah {step + 1} dari {totalSteps}
            </span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(step + 1 / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="survey-content">
          <h2 className="question-title">
            {businessModelQuestions[step].question_text}
          </h2>

          <div className="options-grid">
            {businessModelQuestions[step].options.map((opt, index) => {
              const isSelected =
                answers[businessModelQuestions[step].id] === opt.value;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(opt.value)}
                  className={`option-btn ${isSelected ? "selected" : ""}`}
                >
                  <div className="radio-circle">
                    <div className="radio-dot"></div>
                  </div>
                  <span className="option-text">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="survey-footer">
          <button
            className="btn-back"
            onClick={handleBack}
            disabled={step === 1}
          >
            Kembali
          </button>
          <button onClick={logout} className="btn-back" title="Logout">
            Logout
          </button>
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={selectedOption === undefined}
          >
            {step === totalSteps - 1 ? "Simpan" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}
