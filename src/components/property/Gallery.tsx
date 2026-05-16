"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={`${title} - ${index + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 80vw"
            />
          </motion.div>
        </AnimatePresence>
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2 shadow"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2 shadow"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {index + 1} / {images.length}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setIndex(i)}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
              i === index ? "border-primary" : "border-transparent opacity-70"
            )}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  );
}
