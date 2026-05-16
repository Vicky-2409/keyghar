"use client";

import { useContactAccessContext } from "@/providers/ContactAccessProvider";

export function ContactPassBadge() {
  const { isUnlocked, daysLeft } = useContactAccessContext();

  if (!isUnlocked) return null;

  return (
    <span className="hidden rounded border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-800 lg:inline">
      Pro access · {daysLeft}d left
    </span>
  );
}
