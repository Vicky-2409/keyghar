const CONSENT_KEY = "keyghar-cookie-consent";

export type CookieConsent = "accepted" | "declined" | null;

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "declined") return v;
  return null;
}

export function setCookieConsent(value: "accepted" | "declined"): void {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event("cookie-consent-updated"));
}

export function hasAdConsent(): boolean {
  return getCookieConsent() === "accepted";
}
