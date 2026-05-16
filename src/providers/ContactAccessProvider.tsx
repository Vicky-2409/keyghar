"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ContactPaywallModal } from "@/components/payments/ContactPaywallModal";
import { useContactAccess } from "@/hooks/useContactAccess";

type ContactAccessContextValue = ReturnType<typeof useContactAccess>;

const ContactAccessContext = createContext<ContactAccessContextValue | null>(null);

export function ContactAccessProvider({ children }: { children: ReactNode }) {
  const access = useContactAccess();

  return (
    <ContactAccessContext.Provider value={access}>
      {children}
      <ContactPaywallModal
        open={access.paywallOpen}
        onClose={access.closePaywall}
        onSuccess={access.onPaywallSuccess}
      />
    </ContactAccessContext.Provider>
  );
}

export function useContactAccessContext() {
  const ctx = useContext(ContactAccessContext);
  if (!ctx) {
    throw new Error("useContactAccessContext must be used within ContactAccessProvider");
  }
  return ctx;
}
