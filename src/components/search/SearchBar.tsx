"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAutocompleteSuggestions, type Suggestion } from "@/lib/autocomplete";
import { cn } from "@/lib/cn";
import { CITIES, DEFAULT_CITY } from "@/lib/constants";

type SearchBarProps = {
  defaultQuery?: string;
  defaultCity?: string;
  compact?: boolean;
  className?: string;
};

export function SearchBar({
  defaultQuery = "",
  defaultCity = DEFAULT_CITY,
  compact = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [city, setCity] = useState(defaultCity);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    setSuggestions(getAutocompleteSuggestions(query));
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = useCallback(
    (q: string, c: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (c) params.set("city", c);
      router.push(`/search?${params.toString()}`);
      setOpen(false);
    },
    [router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") submit(query, city);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const s = suggestions[highlight];
      if (s) {
        setQuery(s.query);
        submit(s.query, s.city ?? city);
      } else submit(query, city);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:flex-row sm:items-center",
          compact && "shadow-md"
        )}
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search e.g. 1 BHK in Guindy, Flats in Pune..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search properties"
            aria-autocomplete="list"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-2">
          <MapPin className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl bg-muted/50 px-3 py-2 text-sm font-medium outline-none"
            aria-label="Select city"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={() => submit(query, city)}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
            role="listbox"
          >
            {suggestions.map((s, i) => (
              <li key={`${s.label}-${i}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === highlight}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                    i === highlight && "bg-muted"
                  )}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    setQuery(s.query);
                    submit(s.query, s.city ?? city);
                  }}
                >
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {s.type}
                  </span>
                  {s.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
