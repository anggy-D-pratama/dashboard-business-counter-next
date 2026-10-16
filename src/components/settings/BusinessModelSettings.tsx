'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { defaultModels } from '@/src/constants/defaultModels';
import { useBusinessModel } from '@/src/hooks/useBusinessModel';
import { useAuth } from '@/src/hooks/useAuth';
import { useLocale } from '@/src/contexts/LocaleContext';
import { Modal } from '@/src/components/Modal';
import { Skeleton } from '@/src/components/ui/skeleton';

export function BusinessModelSettings() {
  const { token } = useAuth();
  const { t } = useLocale();
  const {
    isLoading,
    businessModel,
    businessModels,
    getAllModel,
    getCurrentModel,
    upsertModel,
  } = useBusinessModel();

  const [selectedModel, setSelectedModel] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          const localizedModel = t.settings.models[
            apiModel.category as keyof typeof t.settings.models
          ] ?? { name: apiModel.category, description: '', examples: [] };
          return {
            ...apiModel,
            isActive: businessModel?.id === apiModel.id,
            icon: defaultModel.icon || 'solar:box-minimalistic-bold-duotone',
            name: localizedModel.name || apiModel.name,
            description: localizedModel.description || apiModel.description,
            examples: localizedModel.examples || [],
          };
        })
      : defaultModels.map((model) => {
          const localizedModel = t.settings.models[
            model.category as keyof typeof t.settings.models
          ] ?? { name: model.name, description: model.description, examples: model.examples };
          return {
            ...model,
            name: localizedModel.name || model.name,
            description: localizedModel.description || model.description,
            examples: localizedModel.examples || model.examples,
          };
        });

  const handleSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleUpsertModel = async (modelId: string) => {
    setIsSaving(true);
    await upsertModel(modelId);
    setIsSaving(false);
    setShowConfirmModal(false);
    setSelectedModel('');
  };

  return (
    <div className='business-model-section'>
      <div className='card settings-card animate-fade-in'>
        <div className='card-header'>
          <h2>{t.settings.businessModel}</h2>
          <p>{t.settings.businessModelDesc}</p>
        </div>

        {isLoading ? (
          <div
            className='model-grid'
            aria-busy='true'
            aria-label={t.settings.loadingBusinessModels}
          >
            {defaultModels.map((model) => (
              <div
                key={model.id}
                className='card model-card model-card-skeleton'
                aria-hidden='true'
              >
                <div className='model-card-header'>
                  <Skeleton className='model-icon-skeleton' />
                  <Skeleton className='model-badge-skeleton' />
                </div>
                <div className='model-details'>
                  <Skeleton className='model-title-skeleton' />
                  <Skeleton className='model-desc-skeleton' />
                  <Skeleton className='model-desc-skeleton short' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='model-grid'>
            {models.map((model) => (
              <div
                key={model.id}
                className={`card model-card ${model.isActive ? 'active' : ''} ${selectedModel === model.id ? 'selected' : ''}`}
                onClick={() => handleSelect(model.id)}
              >
                <div className='model-card-header'>
                  <div className='model-icon-wrapper'>
                    <Icon icon={model.icon} width='24' height='24' />
                  </div>
                  {model.isActive && (
                    <span className='model-active-badge'>
                      <Icon
                        icon='lucide:check'
                        width='12'
                        height='12'
                        style={{ marginRight: '4px' }}
                      />
                      {t.settings.activeBadge}
                    </span>
                  )}
                </div>

                <div className='model-details'>
                  <h3>{model.name}</h3>
                  <p>{model.description}</p>
                </div>

                <div className='model-examples'>
                  {(model.examples || []).map(
                    (example: string, idx: number) => (
                      <span key={idx} className='example-tag'>
                        {example}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className='form-actions'
          style={{
            marginTop: 'var(--gap-lg)',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--gap-md)',
          }}
        >
          <button
            className='btn btn-primary'
            disabled={
              isLoading || !selectedModel || selectedModel === businessModel?.id
            }
            onClick={() => setShowConfirmModal(true)}
          >
            {t.settings.saveChanges}
          </button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t.settings.confirmChangeTitle}
        icon='solar:danger-triangle-bold-duotone'
        iconColor='var(--warning)'
        footer={
          <>
            <button
              className='btn btn-secondary'
              onClick={() => setShowConfirmModal(false)}
              disabled={isSaving}
            >
              {t.common.cancel}
            </button>
            <button
              className='btn btn-primary'
              onClick={() => handleUpsertModel(selectedModel)}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving && <span className='spinner' aria-hidden='true'></span>}
              {isSaving ? t.settings.saving : t.settings.confirmChange}
            </button>
          </>
        }
      >
        <p>{t.settings.confirmChangeBody}</p>
      </Modal>
    </div>
  );
}
