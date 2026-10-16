"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/logo.png";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import "./page.css";

export default function LoginPage() {
  const { login, isLoading, error: apiError } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError || apiError;

  const validate = () => {
    setLocalError(null);
    const isEmail = identifier.includes("@");
    const isHasNumbers = /\d/.test(identifier);
    const isStartWith62 = identifier.startsWith("62");

    if (!isEmail && isHasNumbers && !isStartWith62) {
      setLocalError("Nomor telepon harus diawali dengan 62.");
      return false;
    }
    return true;
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier || !password || isLoading) return;
    if (!validate()) return;
    await login(identifier, password);
  };

  return (
    <div className="auth-page">
      <section className="auth-card card animate-fade-in">
        <header className="auth-header stack">
          <div className="auth-logo-wrap">
            <Image
              className="auth-logo"
              src={logoImg}
              alt="Notakita Logo"
              width={250}
              height={80}
              priority
            />
          </div>
          <h1>Masuk</h1>
          <p className="lead">Akses analitik bisnis harian Anda</p>
        </header>

        <form onSubmit={handleLogin} className="auth-form stack">
          {error && (
            <div className="error-banner" role="alert">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="identifier">Email atau Telepon</label>
            <input
              id="identifier"
              className="input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              type="text"
              placeholder="Email or 62..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
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
            aria-busy={isLoading}
          >
            {isLoading && <span className="spinner" aria-hidden="true"></span>}
            {isLoading ? "Memproses..." : "Masuk"}
          </button>

          <div className="auth-footer">
            <Link href="/register" aria-disabled={isLoading}>
              Daftar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
