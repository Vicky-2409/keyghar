const STORAGE_KEY = "keyghar-contact-access";
const LEGACY_KEY = "nestlease-contact-access";
const ACCESS_DAYS = 30;

export type ContactAccessRecord = {
  expiresAt: string;
};

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
  if (raw && !localStorage.getItem(STORAGE_KEY) && localStorage.getItem(LEGACY_KEY)) {
    localStorage.setItem(STORAGE_KEY, raw);
    localStorage.removeItem(LEGACY_KEY);
  }
  return raw;
}

export function isContactUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = readRaw();
    if (!raw) return false;
    const data = JSON.parse(raw) as ContactAccessRecord;
    return new Date(data.expiresAt).getTime() > Date.now();
  } catch {
    return false;
  }
}

export function setContactUnlocked(): void {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ACCESS_DAYS);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ expiresAt: expiresAt.toISOString() } satisfies ContactAccessRecord)
  );
  window.dispatchEvent(new Event("contact-access-updated"));
}

export function clearContactAccess(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
  window.dispatchEvent(new Event("contact-access-updated"));
}

export function getContactExpiresAt(): Date | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = readRaw();
    if (!raw) return null;
    const data = JSON.parse(raw) as ContactAccessRecord;
    const d = new Date(data.expiresAt);
    return d.getTime() > Date.now() ? d : null;
  } catch {
    return null;
  }
}

export function daysRemaining(): number {
  const expires = getContactExpiresAt();
  if (!expires) return 0;
  const ms = expires.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
