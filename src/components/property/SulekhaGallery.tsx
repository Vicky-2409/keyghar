"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function SulekhaGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (images.length === 0) return null;

  const thumbCount = expanded ? images.length : Math.min(4, images.length);
  const thumbs = images.slice(0, thumbCount);
  const hiddenCount = images.length - 4;

  return (
    <section id="photos">
      <h2 className="mb-3 border-b border-[#e0e0e0] pb-2 text-lg font-bold">Photos</h2>

      <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded border border-[#e0e0e0] bg-[#eee]">
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 900px) 100vw, 70vw"
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {thumbs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                if (!expanded && i === 3 && hiddenCount > 0) {
                  setExpanded(true);
                }
                setActive(i);
              }}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded border-2 bg-[#eee]",
                active === i ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="120px" />
              {!expanded && i === 3 && hiddenCount > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-bold text-white sm:text-xs">
                  +{hiddenCount} more
                </span>
              )}
            </button>
          ))}
          {expanded &&
            images.slice(4).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i + 4)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded border-2 bg-[#eee]",
                  active === i + 4 ? "border-primary" : "border-transparent"
                )}
              >
                <Image
                  src={src}
                  alt={`${title} ${i + 5}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
