import React, { ReactNode } from "react";
import { Icon } from "@iconify/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  iconColor?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  iconColor = "#3b82f6",
  children,
  footer,
  maxWidth = "450px",
}: ModalProps) {
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
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content card animate-fade-in"
        style={{
          background: "var(--card-bg, #ffffff)",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth,
          width: "90%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
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
            <h3 style={{ margin: 0, color: "var(--text-color, #1f2937)" }}>
              {title}
            </h3>
          </div>
        )}

        <div
          className="modal-body"
          style={{ color: "var(--text-muted, #6b7280)", lineHeight: "1.5" }}
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
