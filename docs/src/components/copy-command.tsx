"use client";

import { useState } from "react";

type Props = {
  command: string;
  variant?: "default" | "inverted";
  className?: string;
};

export function CopyCommand({ command, variant = "default", className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard tidak tersedia (mis. non-HTTPS), abaikan
    }
  }

  const styles =
    variant === "inverted"
      ? "border-white/15 bg-white/10 text-neutral-200 dark:border-black/10 dark:bg-black/5 dark:text-neutral-700"
      : "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

  return (
    <div
      className={`group inline-flex max-w-full items-center gap-3 rounded-lg border py-2 pl-4 pr-2 font-mono text-sm ${styles} ${className}`}
    >
      <span className="select-none opacity-50">$</span>
      <code className="overflow-x-auto whitespace-nowrap">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}