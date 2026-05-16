"use client";

import { useCallback, useEffect, useState } from "react";
import { daysRemaining, isContactUnlocked } from "@/lib/contactAccess";

export function useContactAccess() {
  const [unlocked, setUnlocked] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [pendingSuccess, setPendingSuccess] = useState<(() => void) | null>(null);

  const refresh = useCallback(() => {
    setUnlocked(isContactUnlocked());
    setDaysLeft(daysRemaining());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("contact-access-updated", refresh);
    return () => window.removeEventListener("contact-access-updated", refresh);
  }, [refresh]);

  const requestContactAccess = useCallback(
    (onSuccess: () => void) => {
      if (isContactUnlocked()) {
        onSuccess();
        return;
      }
      setPendingSuccess(() => onSuccess);
      setPaywallOpen(true);
    },
    []
  );

  const onPaywallSuccess = useCallback(() => {
    refresh();
    setPaywallOpen(false);
    pendingSuccess?.();
    setPendingSuccess(null);
  }, [pendingSuccess, refresh]);

  const closePaywall = useCallback(() => {
    setPaywallOpen(false);
    setPendingSuccess(null);
  }, []);

  return {
    isUnlocked: unlocked,
    daysLeft,
    paywallOpen,
    requestContactAccess,
    onPaywallSuccess,
    closePaywall,
    openPaywall: () => setPaywallOpen(true),
  };
}
