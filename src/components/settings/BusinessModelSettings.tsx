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
      <div style={{ padding: "var(--gap-lg)", textAlign: "center" }}>
        <p style={{ color: "var(--muted)" }}>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="business-model-section">
      <div className="card settings-card animate-fade-in">
        <div className="card-header">
          <h2>Model Bisnis</h2>
          <p>
            Pilih model bisnis yang paling sesuai dengan operasional Anda.
            Model bisnis ini akan menentukan kalkulasi laporan intelijen Anda.
          </p>
        </div>

        <div className="model-grid">
          {models.map((model) => (
            <div
              key={model.id}
              className={`card model-card ${model.isActive ? "active" : ""} ${selectedModel === model.id ? "selected" : ""}`}
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
                <h3>{model.name}</h3>
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
            marginTop: "var(--gap-lg)",
            borderTop: "1px solid var(--border)",
            paddingTop: "var(--gap-md)",
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

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Konfirmasi Perubahan"
        icon="solar:danger-triangle-bold-duotone"
        iconColor="var(--warning)"
        footer={
          <>
            <button
              className="btn btn-secondary"
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
