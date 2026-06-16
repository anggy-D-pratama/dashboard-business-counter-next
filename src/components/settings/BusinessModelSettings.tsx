"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { defaultModels } from "@/src/constants/defaultModels";
import { useBusinessModel } from "@/src/hooks/useBusinessModel";
import { useAuth } from "@/src/hooks/useAuth";
import { Modal } from "@/src/components/Modal";

export function BusinessModelSettings() {
  const { token } = useAuth();
  const {
    isLoading,
    businessModel,
    businessModels,
    getAllModel,
    getCurrentModel,
    upsertModel,
  } = useBusinessModel();

  const [selectedModel, setSelectedModel] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    getAllModel();
    getCurrentModel();
  }, [token]);

  const models =
    businessModels.length > 0
      ? businessModels.map((apiModel: any) => {
          const defaultModel =
            defaultModels.find((dm) => dm.category === apiModel.category) ||
            ({} as any);
          return {
            ...apiModel,
            isActive: businessModel?.id === apiModel.id,
            theme: defaultModel.theme || {
              color: "#6b7280",
              bg: "rgba(107, 114, 128, 0.05)",
              badge: "rgba(107, 114, 128, 0.1)",
            },
            icon: defaultModel.icon || "solar:box-minimalistic-bold-duotone",
            examples: [],
          };
        })
      : defaultModels;
  const handleSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleUpsertModel = async (modelId: string) => {
    await upsertModel(modelId);
    setShowConfirmModal(false);
    setSelectedModel("");
  };

  if (isLoading) {
    return (
      <div
        className="tab-panel active"
        role="tabpanel"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="tab-panel active" role="tabpanel">
      <div className="business-model-section">
        <div
          className="card settings-card animate-fade-in"
          style={{ maxWidth: "100%" }}
        >
          <div className="card-header">
            <h3>Model Bisnis</h3>
            <p>
              Pilih model bisnis yang paling sesuai dengan operasional Anda.
              Model bisnis ini akan menentukan kalkulasi laporan intelijen Anda.
            </p>
          </div>

          <div className="model-grid">
            {models.map((model) => (
              <div
                key={model.id}
                className={`model-card ${model.isActive ? "active" : ""} ${selectedModel === model.id ? "selected" : ""}`}
                style={
                  {
                    "--theme-color": model.theme.color,
                    "--theme-bg": model.theme.bg,
                    "--theme-badge": model.theme.badge,
                  } as React.CSSProperties
                }
                onClick={() => handleSelect(model.id)}
              >
                <div className="model-card-header">
                  <div className="model-icon-wrapper">
                    <Icon icon={model.icon} width="24" height="24" />
                  </div>
                  {model.isActive && (
                    <span className="model-active-badge">
                      <Icon
                        icon="lucide:check"
                        width="12"
                        height="12"
                        style={{ marginRight: "4px" }}
                      />
                      Aktif
                    </span>
                  )}
                </div>

                <div className="model-details">
                  <h4>{model.name}</h4>
                  <p>{model.description}</p>
                </div>

                <div className="model-examples">
                  {(model.examples || []).map(
                    (example: string, idx: number) => (
                      <span key={idx} className="example-tag">
                        {example}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="form-actions"
            style={{
              marginTop: "2rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
            }}
          >
            <button
              className="btn btn-primary"
              disabled={!selectedModel || selectedModel === businessModel?.id}
              onClick={() => setShowConfirmModal(true)}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Konfirmasi Perubahan"
        icon="solar:danger-triangle-bold-duotone"
        iconColor="#f59e0b"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleUpsertModel(selectedModel)}
            >
              {isLoading ? "Menyimpan..." : "Ya, Ubah Model"}
            </button>
          </>
        }
      >
        <p>
          Apakah Anda yakin ingin mengubah model bisnis Anda? Perubahan ini
          akan mempengaruhi bagaimana kalkulasi laporan dan intelijen bisnis
          Anda diproses.
        </p>
      </Modal>
    </div>
  );
}
