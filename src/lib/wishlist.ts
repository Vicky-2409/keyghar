const STORAGE_KEY = "keyghar-wishlist";
const LEGACY_KEY = "nestlease-wishlist";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_KEY);
      }
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getWishlist(): string[] {
  return readWishlist();
}

export function toggleWishlist(slug: string): string[] {
  const current = readWishlist();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("wishlist-updated"));
  return next;
}

export function isWishlisted(slug: string): boolean {
  return readWishlist().includes(slug);
}
