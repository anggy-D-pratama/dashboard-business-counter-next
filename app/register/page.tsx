'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/public/logo.png';
import { useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useLocale } from '@/src/contexts/LocaleContext';
import './page.css';

export default function RegisterPage() {
  const { register, isLoading, error: apiError } = useAuth();
  const { t } = useLocale();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const error = localError || apiError;

  const passwordRules = [
    { label: t.common.passwordRuleMin, valid: password.length >= 6 },
    { label: t.common.passwordRuleUpper, valid: /[A-Z]/.test(password) },
    { label: t.common.passwordRuleLower, valid: /[a-z]/.test(password) },
    { label: t.common.passwordRuleNumber, valid: /\d/.test(password) },
    { label: t.common.passwordRuleSpecial, valid: /[@$!%*?&]/.test(password) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const nameRegex = /^[a-zA-Z\s]*$/;
  const phoneRegex = /^[0-9]{8,13}$/;

  const onPhoneInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    let val = target.value;

    val = val.replace(/\D/g, '');
    if (val.startsWith('0')) {
      val = val.substring(1);
    }
    setPhone(val);
  };

  const validate = () => {
    setLocalError(null);
    if (!nameRegex.test(name)) {
      setLocalError(t.auth.errorNameRequired);
      return false;
    }
    if (!email) {
      setLocalError(t.auth.errorEmailRequired);
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setLocalError(t.auth.errorPhoneRequired);
      return false;
    }
    if (!isPasswordValid) {
      setLocalError(t.auth.errorPasswordRules);
      return false;
    }
    if (password !== password_confirmation) {
      setLocalError(t.auth.errorPasswordMismatch);
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
    <div className='auth-page'>
      <section className='auth-card card animate-fade-in'>
        <header className='auth-header stack'>
          <div className='auth-logo-wrap'>
            <Image
              className='auth-logo'
              src={logoImg}
              alt='Notakita Logo'
              width={250}
              height={80}
              priority
            />
          </div>
          <h1>{t.auth.registerHeading}</h1>
          <p className='lead'>{t.auth.registerLead}</p>
        </header>

        <form onSubmit={handleRegister} className='auth-form stack'>
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

          <div className='field'>
            <label htmlFor='name'>{t.auth.nameLabel}</label>
            <input
              id='name'
              className='input'
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder={t.auth.namePlaceholder}
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='email'>{t.auth.emailLabel}</label>
            <input
              id='email'
              className='input'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type='email'
              placeholder={t.auth.emailPlaceholder}
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='phone'>{t.auth.phoneLabel}</label>
            <div className='phone-input-minimal'>
              <div className='prefix'>62</div>
              <input
                id='phone'
                value={phone}
                type='tel'
                placeholder={t.auth.phonePlaceholder}
                onChange={onPhoneInput}
                required
              />
            </div>
          </div>

          <div className='field'>
            <label htmlFor='password'>{t.auth.passwordLabel}</label>
            <div className='password-input-wrapper'>
              <input
                id='password'
                className='input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder={t.common.passwordPlaceholder}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? t.common.hidePassword : t.common.showPassword}
              >
                {showPassword ? (
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
          </div>

          <div className='field'>
            <label htmlFor='confirm'>{t.auth.confirmPasswordLabel}</label>
            <div className='password-input-wrapper'>
              <input
                id='confirm'
                className='input'
                value={password_confirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t.common.passwordPlaceholder}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? t.common.hidePassword : t.common.showPassword}
              >
                {showConfirmPassword ? (
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

          <button
            type='submit'
            className='btn btn-primary w-full'
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading && <span className='spinner' aria-hidden='true'></span>}
            {isLoading ? t.auth.registerLoading : t.auth.registerSubmit}
          </button>

          <div className='auth-footer'>
            <Link href='/login'>{t.auth.registerFooterLink}</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
