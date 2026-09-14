"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/** Aşağıdan açılan modal vərəq (bottom sheet). */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="Bağla"
        onClick={onClose}
        className="fade-in absolute inset-0 h-full w-full cursor-default bg-ink-950/40"
      />
      <div className="sheet-in absolute inset-x-0 bottom-0 mx-auto max-w-[30rem]">
        <div className="rounded-t-3xl bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_-15px_rgba(15,23,42,0.25)]">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-200" />
          {title && (
            <h2 className="mb-4 text-base font-semibold text-ink-900">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
