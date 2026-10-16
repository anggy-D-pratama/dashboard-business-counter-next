import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocale } from '../../contexts/LocaleContext';

export function ChangePasswordForm() {
  const { changePassword, isLoading, error: apiError } = useAuth();
  const { t } = useLocale();

  const [current_password, setCurrentPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [show_current_password, setShowCurrentPassword] = useState(false);
  const [show_new_password, setShowNewPassword] = useState(false);
  const [show_password_confirmation, setShowPasswordConfirmation] =
    useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || apiError;

  const passwordRules = [
    { label: t.common.passwordRuleMin, valid: new_password.length >= 6 },
    { label: t.common.passwordRuleUpper, valid: /[A-Z]/.test(new_password) },
    { label: t.common.passwordRuleLower, valid: /[a-z]/.test(new_password) },
    { label: t.common.passwordRuleNumber, valid: /\d/.test(new_password) },
    {
      label: `${t.common.passwordRuleSpecial} (@$!%*?&)`,
      valid: /[@$!%*?&]/.test(new_password),
    },
  ];

  const isPasswordValid = new_password
    ? passwordRules.every((rule) => rule.valid)
    : false;

  const validate = () => {
    setLocalError(null);
    setSuccessMessage('');
    if (!current_password) {
      setLocalError(t.settings.errorCurrentPasswordRequired);
      return false;
    }
    if (!isPasswordValid) {
      setLocalError(t.settings.errorPasswordRules);
      return false;
    }
    if (new_password !== password_confirmation) {
      setLocalError(t.settings.errorPasswordMismatch);
      return false;
    }
    if (current_password === new_password) {
      setLocalError(t.settings.errorPasswordSame);
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
      setSuccessMessage(result.message || t.settings.passwordChanged);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowPasswordConfirmation(false);
    }
  };

  return (
    <div className='settings-grid'>
      <div className='card settings-card animate-fade-in'>
        <div className='card-header'>
          <h2>{t.settings.changePasswordTitle}</h2>
          <p>{t.settings.changePasswordDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className='settings-form'>
          {error && (
            <div className='error-banner' role='alert'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <line x1='12' y1='8' x2='12' y2='12'></line>
                <line x1='12' y1='16' x2='12.01' y2='16'></line>
              </svg>
              {error}
            </div>
          )}

          {successMessage && (
            <div className='success-banner' role='status'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
              {successMessage}
            </div>
          )}

          <div className='field'>
            <label htmlFor='current_password'>{t.settings.currentPasswordLabel}</label>
            <div className='password-input-wrapper'>
              <input
                id='current_password'
                className='input'
                type={show_current_password ? 'text' : 'password'}
                value={current_password}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
                placeholder={t.common.passwordPlaceholder}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => {
                  setShowCurrentPassword(!show_current_password);
                }}
                tabIndex={-1}
                aria-label={show_current_password ? t.common.hidePassword : t.common.showPassword}
              >
                {show_current_password ? (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                    <line x1='1' y1='1' x2='23' y2='23'></line>
                  </svg>
                ) : (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className='form-divider'></div>

          <div className='field'>
            <label htmlFor='new_password'>{t.settings.newPasswordLabel}</label>
            <div className='password-input-wrapper'>
              <input
                id='new_password'
                className='input'
                type={show_new_password ? 'text' : 'password'}
                value={new_password}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder={t.common.passwordPlaceholder}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => {
                  setShowNewPassword(!show_new_password);
                }}
                tabIndex={-1}
                aria-label={show_new_password ? t.common.hidePassword : t.common.showPassword}
              >
                {show_new_password ? (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                    <line x1='1' y1='1' x2='23' y2='23'></line>
                  </svg>
                ) : (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                )}
              </button>
            </div>

            {new_password.length > 0 && (
              <div className='password-requirements'>
                {passwordRules.map((rule, index) => (
                  <div
                    key={index}
                    className={`rule ${rule.valid ? 'valid' : ''}`}
                  >
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='3'
                      aria-hidden='true'
                    >
                      {rule.valid ? (
                        <polyline points='20 6 9 17 4 12'></polyline>
                      ) : (
                        <>
                          <line x1='18' y1='6' x2='6' y2='18'></line>
                          <line x1='6' y1='6' x2='18' y2='18'></line>
                        </>
                      )}
                    </svg>
                    {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='field'>
            <label htmlFor='confirm_password'>
              {t.settings.confirmPasswordLabel}
            </label>
            <div className='password-input-wrapper'>
              <input
                id='confirm_password'
                className='input'
                type={show_password_confirmation ? 'text' : 'password'}
                value={password_confirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
                placeholder={t.common.passwordPlaceholder}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() =>
                  setShowPasswordConfirmation(!show_password_confirmation)
                }
                tabIndex={-1}
                aria-label={show_password_confirmation ? t.common.hidePassword : t.common.showPassword}
              >
                {show_password_confirmation ? (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                    <line x1='1' y1='1' x2='23' y2='23'></line>
                  </svg>
                ) : (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    aria-hidden='true'
                  >
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className='form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={isLoading || !isPasswordValid}
              aria-busy={isLoading}
            >
              {isLoading && <span className='spinner' aria-hidden='true'></span>}
              {isLoading ? t.settings.updating : t.settings.changePasswordBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
