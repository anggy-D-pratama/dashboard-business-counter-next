"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import { Icon } from "@iconify/react";
import { useLocale } from "../contexts/LocaleContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  iconColor?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  className?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  iconColor = "#3b82f6",
  children,
  footer,
  maxWidth = "450px",
  className,
}: ModalProps) {
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const dialog = dialogRef.current;
    if (dialog) {
      const firstFocusable =
        dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? dialog).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const dialogNode = dialogRef.current;
      if (!dialogNode) return;

      const focusable = Array.from(
        dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialogNode.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogNode.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogNode.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const trigger = previouslyFocusedRef.current;
      if (trigger && document.contains(trigger)) {
        trigger.focus();
      }
      previouslyFocusedRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "color-mix(in oklch, var(--fg) 55%, transparent)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : t.a11y.dialogLabel}
        tabIndex={-1}
        className={`modal-content card animate-fade-in${
          className ? ` ${className}` : ""
        }`}
        style={{
          background: "var(--surface, var(--bg-card))",
          padding: "2rem",
          borderRadius: "var(--radius-lg, 12px)",
          maxWidth,
          width: "90%",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          outline: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            className="modal-header"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {icon && (
              <Icon icon={icon} color={iconColor} width="24" height="24" />
            )}
            <h3
              id={titleId}
              style={{ margin: 0, color: "var(--text-main, var(--fg))" }}
            >
              {title}
            </h3>
          </div>
        )}

        <div
          className="modal-body"
          style={{
            color: "var(--text-muted, var(--muted))",
            lineHeight: "1.5",
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            className="modal-footer"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
