import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function ChangePasswordForm() {
  const { changePassword, isLoading, error: apiError } = useAuth();

  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [show_current_password, setShowCurrentPassword] = useState(false);
  const [show_new_password, setShowNewPassword] = useState(false);
  const [show_password_confirmation, setShowPasswordConfirmation] =
    useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || apiError;

  const passwordRules = [
    { label: "Minimal 6 karakter", valid: new_password.length >= 6 },
    { label: "Satu huruf besar", valid: /[A-Z]/.test(new_password) },
    { label: "Satu huruf kecil", valid: /[a-z]/.test(new_password) },
    { label: "Satu angka", valid: /\d/.test(new_password) },
    {
      label: "Satu karakter spesial (@$!%*?&)",
      valid: /[@$!%*?&]/.test(new_password),
    },
  ];

  const isPasswordValid = new_password
    ? passwordRules.every((rule) => rule.valid)
    : false;

  const validate = () => {
    setLocalError(null);
    setSuccessMessage("");
    if (!current_password) {
      setLocalError("Kata sandi saat ini wajib diisi.");
      return false;
    }
    if (!isPasswordValid) {
      setLocalError("Harap penuhi semua syarat kata sandi baru.");
      return false;
    }
    if (new_password !== password_confirmation) {
      setLocalError("Kata sandi baru tidak cocok.");
      return false;
    }
    if (current_password === new_password) {
      setLocalError(
        "Kata sandi baru harus berbeda dengan kata sandi saat ini.",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await changePassword(
      current_password,
      new_password,
      password_confirmation,
    );

    if (result.success) {
      setSuccessMessage(result.message || "Kata sandi berhasil diperbarui.");
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowPasswordConfirmation(false);
    }
  };

  return (
    <div className="tab-panel active" role="tabpanel">
      <div className="settings-grid">
        <div className="card settings-card animate-fade-in">
          <div className="card-header">
            <h3>Ubah Kata Sandi</h3>
            <p>Perbarui kata sandi untuk menjaga keamanan akun Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
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

            {successMessage && (
              <div className="success-banner">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {successMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="current_password">Kata Sandi Saat Ini</label>
              <div className="password-input-wrapper">
                <input
                  id="current_password"
                  type={show_current_password ? "text" : "password"}
                  value={current_password}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => {
                    setShowCurrentPassword(!show_current_password);
                  }}
                  tabIndex={-1}
                >
                  {show_current_password ? (
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

            <div className="form-divider"></div>

            <div className="form-group">
              <label htmlFor="new_password">Kata Sandi Baru</label>
              <div className="password-input-wrapper">
                <input
                  id="new_password"
                  type={show_new_password ? "text" : "password"}
                  value={new_password}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => {
                    setShowNewPassword(!show_new_password);
                  }}
                  tabIndex={-1}
                >
                  {show_new_password ? (
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

              {new_password.length > 0 && (
                <div className="password-requirements">
                  {passwordRules.map((rule, index) => (
                    <div
                      key={index}
                      className={`rule ${rule.valid ? "valid" : ""}`}
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
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirm_password"
                  type={show_password_confirmation ? "text" : "password"}
                  value={password_confirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPasswordConfirmation(!show_password_confirmation)
                  }
                  tabIndex={-1}
                >
                  {show_password_confirmation ? (
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

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !isPasswordValid}
              >
                {isLoading && <span className="spinner"></span>}
                {isLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
