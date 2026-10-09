"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Mount to open, unmount to close. The native dialog handles focus trapping and Escape.
export function Modal({ label, className, onClose, children }: { label: string; className?: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={`modal${className ? ` ${className}` : ""}`}
      aria-label={label}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="modal-body">
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </dialog>
  );
}
