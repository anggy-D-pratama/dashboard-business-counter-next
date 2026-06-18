"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/logo.png";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import "./page.css";

export default function RegisterPage() {
  const { register, isLoading, error: apiError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError || apiError;

  const passwordRules = [
    { label: "Minimal 6 karakter", valid: password.length >= 6 },
    { label: "Satu huruf besar", valid: /[A-Z]/.test(password) },
    { label: "Satu huruf kecil", valid: /[a-z]/.test(password) },
    { label: "Satu angka", valid: /\d/.test(password) },
    { label: "Satu karakter spesial", valid: /[@$!%*?&]/.test(password) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const nameRegex = /^[a-zA-Z\s]*$/;
  const phoneRegex = /^[0-9]{8,13}$/;

  const onPhoneInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    let val = target.value;

    val = val.replace(/\D/g, "");
    if (val.startsWith("0")) {
      val = val.substring(1);
    }
    setPhone(val);
  };

  const validate = () => {
    setLocalError(null);
    if (!nameRegex.test(name)) {
      setLocalError("Nama wajib diisi.");
      return false;
    }
    if (!email) {
      setLocalError("Email wajib diisi.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setLocalError("Nomor telepon wajib diisi.");
      return false;
    }
    if (!isPasswordValid) {
      setLocalError("Kata sandi tidak memenuhi syarat.");
      return false;
    }
    if (password !== password_confirmation) {
      setLocalError("Kata sandi tidak cocok.");
      return false;
    }
    return true;
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    const fullPhone = `62${phone}`;
    await register(name, email, fullPhone, password, password_confirmation);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card animate-fade-in">
        <div className="auth-header">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Image src={logoImg} alt="Notakita Logo" width={250} height={80} style={{ objectFit: "cover", objectPosition: "center" }} priority />
          </div>
          <h1>Daftar</h1>
          <p>Akses analitik bisnis harian Anda</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && (
            <div className="error-banner">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="email@notakita.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Nomor Telepon</label>
            <div className="phone-input-minimal">
              <div className="prefix">62</div>
              <input
                id="phone"
                value={phone}
                type="tel"
                placeholder="8123456789"
                onChange={onPhoneInput}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? `text` : `password`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <div className="password-requirements">
              {passwordRules.map((rule, index) => (
                <div
                  key={index}
                  className={`rule ${rule.valid ? `valid` : ``}`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    {rule.valid ? (
                      <polyline points="20 6 9 17 4 12"></polyline>
                    ) : (
                      <>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </>
                    )}
                  </svg>
                  {rule.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Konfirmasi Kata Sandi</label>
            <div className="password-input-wrapper">
              <input
                id="confirm"
                value={password_confirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading && <span className="spinner"></span>}
            {isLoading ? "Mendaftar..." : "Daftar"}
          </button>

          <div className="auth-footer">
            <Link href="/login">Masuk</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
