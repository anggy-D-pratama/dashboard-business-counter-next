"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { Modal } from "./Modal";
import { UserCategory } from "../hooks/useCategories";
import "./CategoryManagerModal.css";

const DEFAULT_COLOR = "#6366F1";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: UserCategory[];
  isLoading: boolean;
  error: string | null;
  onCreate: (name: string, color?: string) => Promise<void>;
  onRename: (id: string, name: string, color?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  isLoading,
  error,
  onCreate,
  onRename,
  onDelete,
}: CategoryManagerModalProps) {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState(DEFAULT_COLOR);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setColor(DEFAULT_COLOR);
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFormError(null);

    try {
      if (editingId) {
        await onRename(editingId, editingName.trim(), editingColor);
      } else {
        await onCreate(name.trim(), color);
      }
      resetForm();
    } catch (err) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : t.categories.errorSave,
      );
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (category: UserCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingColor(category.color || DEFAULT_COLOR);
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.categories.deleteConfirm)) return;

    setBusy(true);
    setFormError(null);

    try {
      await onDelete(id);
    } catch (err) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : t.categories.errorDelete,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.categories.manageTitle}
      icon="mdi:tag-outline"
      maxWidth="560px"
    >
      <div className="categories-manager stack">
        {isLoading ? (
          <p className="meta" role="status">
            {t.categories.loading}
          </p>
        ) : null}

        {error ? (
          <p className="category-form-error" role="alert">
            {error}
          </p>
        ) : null}

        {formError ? (
          <p className="category-form-error" role="alert">
            {formError}
          </p>
        ) : null}

        <form className="category-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="category-name">{t.categories.nameLabel}</label>
            <input
              id="category-name"
              className="input"
              type="text"
              maxLength={100}
              required
              value={editingId ? editingName : name}
              onChange={(event) => {
                if (editingId) {
                  setEditingName(event.target.value);
                } else {
                  setName(event.target.value);
                }
              }}
            />
          </div>

          <div className="field">
            <label htmlFor="category-color">{t.categories.colorLabel}</label>
            <input
              id="category-color"
              className="input category-color-input"
              type="color"
              value={editingId ? editingColor : color}
              onChange={(event) => {
                if (editingId) {
                  setEditingColor(event.target.value);
                } else {
                  setColor(event.target.value);
                }
              }}
            />
          </div>

          <div className="category-form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {editingId ? t.categories.saveRename : t.categories.add}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                {t.common.cancel}
              </button>
            ) : null}
          </div>
        </form>

        <div className="category-list" aria-live="polite">
          {!isLoading && categories.length === 0 ? (
            <p className="meta">{t.categories.empty}</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="category-list-item">
                  <span
                    className="category-swatch"
                    style={{
                      backgroundColor: category.color || "transparent",
                      borderColor: category.color || "var(--border)",
                    }}
                    aria-hidden="true"
                  />
                  <span className="category-name">{category.name}</span>
                  <div className="category-item-actions">
                    <button
                      type="button"
                      className="btn btn-filter"
                      onClick={() => startEdit(category)}
                      disabled={busy}
                    >
                      {t.categories.rename}
                    </button>
                    <button
                      type="button"
                      className="btn btn-filter category-delete-btn"
                      onClick={() => handleDelete(category.id)}
                      disabled={busy}
                    >
                      {t.categories.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
