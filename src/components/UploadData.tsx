"use client";

import { useEffect, useRef, useState } from "react";
import { useUpload } from "../hooks/useUpload";
import "./UploadData.css";

export function UploadData() {
  const {
    uploadStatus,
    setUploadStatus,
    selectedFile,
    uploadMessage,
    validateAndUploadFile,
    resumePolling,
  } = useUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resumePolling();
  }, [resumePolling]);

  const handleFileUpload = (e: any) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
    target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    validateAndUploadFile(file);
  };

  const triggerFileInput = () => {
    if (uploadStatus === "idle" || uploadStatus === "error") {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="upload-view">
      <header className="header animate-fade-in">
        <div className="header-text">
          <h1>Integrasi Data</h1>
          <p>Sinkronkan data bisnis Anda melalui unggahan spreadsheet yang aman.</p>
        </div>
      </header>

      <div className="upload-grid">
        <div
          className={`drop-container card animate-fade-in ${uploadStatus === "uploading" || uploadStatus === "processing" ? "loading" : uploadStatus === "success" ? "success" : uploadStatus === "error" ? "error" : ""}`}
          onDragOver={(e: any) => {
            e.preventDefault();
          }}
          onDrop={onDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />

          <div className="drop-content">
            <div className="icon-box">
              {uploadStatus !== "success" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>

            {(uploadStatus === "idle" || uploadStatus === "error") && (
              <>
                <h3>Pilih File Sumber</h3>
                <p>Tarik dan lepas atau klik untuk mencari file</p>
                <div className="file-types">
                  <span>CSV</span>
                  <span>XLSX</span>
                  <span>XLS</span>
                </div>
                {uploadStatus === "error" && (
                  <p className="error-msg">{uploadMessage}</p>
                )}
              </>
            )}

            {(uploadStatus === "uploading" ||
              uploadStatus === "processing") && (
              <>
                <h3 className="status-text">{uploadMessage}</h3>
                {selectedFile && (
                  <p className="file-name">{selectedFile.name}</p>
                )}

                <div className="progress-container">
                  <div
                    className={`progress-bar ${uploadStatus === "processing" ? "indeterminate" : ""}`}
                  ></div>
                </div>
              </>
            )}

            {uploadStatus === "success" && (
              <div className="success-box">
                <h3>Proses Selesai</h3>
                <p>{uploadMessage}</p>

                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadStatus("idle");
                  }}
                >
                  Unggah Lainnya
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className="card guidelines animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="guidelines-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h3>Spesifikasi Teknis</h3>
          </div>
          <div className="spec-list">
            <div className="spec-item">
              <span className="spec-label">Skema</span>
              <code className="spec-value">
                invoice_number, income, outcome, time
              </code>
            </div>
            <div className="spec-item">
              <span className="spec-label">Maksimal Ukuran</span>
              <span className="spec-value">25.00 MB</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Baris Header</span>
              <span className="spec-value">Wajib (Baris 1)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Set Karakter</span>
              <span className="spec-value">UTF-8 Direkomendasikan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
