"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import { useAuth } from "@/src/hooks/useAuth";
import { useBusinessModel } from "@/src/hooks/useBusinessModel";
import { useLocale } from "@/src/contexts/LocaleContext";

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
  const { t } = useLocale();

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
        <div className="card">
          <p className="lead">{t.onboarding.loadingQuestions}</p>
        </div>
      </div>
    );
  }

  const selectedOption = answers[businessModelQuestions[step].id];

  const stepIndicator = t.onboarding.stepIndicator
    .replace("{step}", String(step + 1))
    .replace("{total}", String(totalSteps));

  return (
    <div className="survey-wrapper">
      <main className="survey-card card">
        <header className="survey-header stack">
          <div className="survey-logo-wrap">
            <img
              src="/logo.png"
              alt="NotaKita Logo"
              className="survey-logo"
            />
          </div>
          <div className="progress-container row-between">
            <span className="meta">
              {stepIndicator}
            </span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(step + 1 / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </header>

        <div className="survey-content stack">
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
                  className={`option-card card ${isSelected ? "selected" : ""}`}
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

        <footer className="survey-footer row-between">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={step === 1}
          >
            {t.onboarding.back}
          </button>
          <button
            onClick={logout}
            className="btn btn-ghost"
            title={t.onboarding.logout}
          >
            {t.onboarding.logout}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selectedOption === undefined}
          >
            {step === totalSteps - 1 ? t.onboarding.save : t.onboarding.next}
          </button>
        </footer>
      </main>
    </div>
  );
}
