"use client";

import { useCallback, useEffect, useState } from "react";
import { getWishlist, isWishlisted, toggleWishlist } from "@/lib/wishlist";

export function useWishlist(id: string) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWishlisted(id));
    const handler = () => setSaved(isWishlisted(id));
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, [id]);

  const toggle = useCallback(() => {
    toggleWishlist(id);
    setSaved(isWishlisted(id));
  }, [id]);

  return { saved, toggle };
}

export function useWishlistCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getWishlist().length);
    update();
    window.addEventListener("wishlist-updated", update);
    return () => window.removeEventListener("wishlist-updated", update);
  }, []);
  return count;
}
