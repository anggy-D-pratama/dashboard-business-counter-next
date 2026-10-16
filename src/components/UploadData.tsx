'use client';

import { useEffect, useRef } from 'react';
import { useUpload } from '../hooks/useUpload';
import { useLocale } from '../contexts/LocaleContext';
import './UploadData.css';

export function UploadData() {
  const {
    uploadStatus,
    setUploadStatus,
    selectedFile,
    uploadMessage,
    validateAndUploadFile,
    resumePolling,
  } = useUpload();

  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resumePolling();
  }, [resumePolling]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
    target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    validateAndUploadFile(file);
  };

  const triggerFileInput = () => {
    if (uploadStatus === 'idle' || uploadStatus === 'error') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className='upload-view'>
      <header className='upload-header animate-fade-in'>
        <h1>{t.upload.heading}</h1>
        <p className='lead'>{t.upload.lead}</p>
      </header>

      <div className='upload-grid'>
        <div
          className={`dropzone card animate-fade-in ${
            uploadStatus === 'uploading' || uploadStatus === 'processing'
              ? 'loading'
              : uploadStatus === 'success'
                ? 'success'
                : uploadStatus === 'error'
                  ? 'error'
                  : ''
          }`}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
          }}
          onDrop={onDrop}
          onClick={triggerFileInput}
        >
          <input
            type='file'
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          />

          <div className='drop-content'>
            <div className='icon-box'>
              {uploadStatus !== 'success' ? (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='var(--success)'
                  strokeWidth='3'
                >
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
              )}
            </div>

            {(uploadStatus === 'idle' || uploadStatus === 'error') && (
              <>
                <h3>{t.upload.dropzoneTitle}</h3>
                <p>{t.upload.dropzoneHint}</p>
                <div className='file-types'>
                  <span className='btn-filter file-type'>CSV</span>
                  <span className='btn-filter file-type'>XLSX</span>
                  <span className='btn-filter file-type'>XLS</span>
                </div>
                <p className='file-meta'>{t.upload.maxSize}</p>
                {uploadStatus === 'error' && (
                  <p className='error-msg'>{uploadMessage}</p>
                )}
              </>
            )}

            {(uploadStatus === 'uploading' ||
              uploadStatus === 'processing') && (
              <>
                <h3 className='status-text'>{uploadMessage}</h3>
                {selectedFile && (
                  <p className='file-name'>{selectedFile.name}</p>
                )}

                <div className='progress'>
                  <div
                    className={`bar ${uploadStatus === 'processing' ? 'indeterminate' : ''}`}
                  ></div>
                </div>
              </>
            )}

            {uploadStatus === 'success' && (
              <div className='success-box'>
                <h3>{t.upload.processingSuccess}</h3>
                <p>{uploadMessage}</p>

                <button
                  className='btn btn-secondary'
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadStatus('idle');
                  }}
                >
                  {t.upload.uploadAnother}
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className='card spec-card animate-fade-in'
          style={{ animationDelay: '0.2s' }}
        >
          <div className='spec-header'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='var(--accent)'
              strokeWidth='2'
            >
              <circle cx='12' cy='12' r='10'></circle>
              <line x1='12' y1='16' x2='12' y2='12'></line>
              <line x1='12' y1='8' x2='12.01' y2='8'></line>
            </svg>
            <h3>{t.upload.specTitle}</h3>
          </div>
          <div className='spec-list'>
            <div className='spec-item'>
              <span className='meta spec-label'>{t.upload.specSchemaLabel}</span>
              <code className='spec-value'>{t.upload.specSchemaValue}</code>
            </div>
            <div className='spec-item'>
              <span className='meta spec-label'>{t.upload.specMaxSizeLabel}</span>
              <span className='spec-value'>{t.upload.specMaxSizeValue}</span>
            </div>
            <div className='spec-item'>
              <span className='meta spec-label'>{t.upload.specHeaderRowLabel}</span>
              <span className='spec-value'>{t.upload.specHeaderRowValue}</span>
            </div>
            <div className='spec-item'>
              <span className='meta spec-label'>{t.upload.specCharsetLabel}</span>
              <span className='spec-value'>{t.upload.specCharsetValue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
