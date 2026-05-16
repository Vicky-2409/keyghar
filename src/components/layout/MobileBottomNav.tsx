"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { getWishlist } from "@/lib/wishlist";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/saved", icon: Heart, label: "Saved" },
  { href: "/search?propertyType=pg", icon: User, label: "PG" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const update = () => setWishlistCount(getWishlist().length);
    update();
    window.addEventListener("wishlist-updated", update);
    return () => window.removeEventListener("wishlist-updated", update);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href === "/search" && pathname.startsWith("/search"));
          const isSaved = href === "/saved";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isSaved && wishlistCount > 0 && "fill-rose-500 text-rose-500")} />
              {label}
              {isSaved && wishlistCount > 0 && (
                <span className="absolute right-1 top-0 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
