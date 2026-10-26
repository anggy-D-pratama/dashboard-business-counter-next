"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

export function ProfileSettings() {
  const { user } = useAuth();
  const { t } = useLocale();
  const {
    profile,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateProfile,
    setError,
    setSuccessMessage,
  } = useProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);
  const [prefilledFromAuth, setPrefilledFromAuth] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (profile && !prefilledFromProfile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setBusinessName(profile.business_name || "");
      setBusinessAddress(profile.business_address || "");
      setPrefilledFromProfile(true);
    }
  }, [profile, prefilledFromProfile]);

  useEffect(() => {
    if (!profile && user && !prefilledFromAuth) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPrefilledFromAuth(true);
    }
  }, [profile, user, prefilledFromAuth]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const email = profile?.email || user?.email || "";

  const validate = (): string | null => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedBusinessName = businessName.trim();
    const trimmedBusinessAddress = businessAddress.trim();

    if (trimmedName.length < 3 || trimmedName.length > 50) {
      return t.settings.errorName;
    }
    if (trimmedPhone.length < 10 || trimmedPhone.length > 15) {
      return t.settings.errorPhoneLength;
    }
    if (!trimmedPhone.startsWith("62")) {
      return t.settings.errorPhonePrefix;
    }
    if (trimmedBusinessName.length > 100) {
      return t.settings.errorBusinessName;
    }
    if (trimmedBusinessAddress.length > 255) {
      return t.settings.errorBusinessAddress;
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      business_name: businessName.trim(),
      business_address: businessAddress.trim(),
    });

    if (result.success) {
      setSuccessMessage(result.message || t.settings.profileSaved);
    }
  };

  return (
    <div className='settings-grid'>
      <div className='card settings-card animate-fade-in'>
        <div className='card-header'>
          <h2>{t.settings.profileCardTitle}</h2>
          <p>{t.settings.profileCardDesc}</p>
        </div>

        {isLoading ? (
          <div className='profile-state' role='status' aria-live='polite'>
            <span className='spinner' aria-hidden='true'></span>
            {t.settings.profileLoading}
          </div>
        ) : (
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
              <label htmlFor='business_name'>
                {t.settings.businessNameLabel}
              </label>
              <input
                id='business_name'
                className='input'
                type='text'
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder={t.settings.businessNamePlaceholder}
                maxLength={100}
              />
            </div>

            <div className='field'>
              <label htmlFor='business_address'>
                {t.settings.businessAddressLabel}
              </label>
              <textarea
                id='business_address'
                className='input'
                value={businessAddress}
                onChange={(event) => setBusinessAddress(event.target.value)}
                placeholder={t.settings.businessAddressPlaceholder}
                maxLength={255}
                rows={3}
              />
            </div>

            <div className='field'>
              <label htmlFor='owner_name'>{t.settings.ownerNameLabel}</label>
              <input
                id='owner_name'
                className='input'
                type='text'
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.settings.ownerNamePlaceholder}
                maxLength={50}
              />
            </div>

            <div className='field'>
              <label htmlFor='profile_phone'>{t.settings.phoneLabel}</label>
              <input
                id='profile_phone'
                className='input'
                type='tel'
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t.settings.phonePlaceholder}
                maxLength={15}
              />
            </div>

            <div className='field'>
              <label htmlFor='profile_email'>{t.settings.emailLabel}</label>
              <input
                id='profile_email'
                className='input profile-readonly-input'
                type='email'
                value={email}
                readOnly
              />
              <p className='setting-hint'>{t.settings.emailReadonlyNote}</p>
            </div>

            <div className='form-actions'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSaving}
                aria-busy={isSaving}
              >
                {isSaving && (
                  <span className='spinner' aria-hidden='true'></span>
                )}
                {isSaving ? t.settings.profileSaving : t.settings.profileSaveBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
