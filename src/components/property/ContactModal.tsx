"use client";

import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Property } from "@/lib/types";
import { BRAND_NAME } from "@/lib/constants";

export function ContactModal({
  open,
  onClose,
  property,
}: {
  open: boolean;
  onClose: () => void;
  property: Property;
}) {
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setRevealed(false);
      setSubmitted(false);
      setMessage("");
    }, 300);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Contact Owner">
      <div className="space-y-4">
        <div className="rounded-xl bg-muted p-4">
          <p className="font-semibold">{property.owner.name}</p>
          <p className="text-sm text-muted-foreground">{property.owner.role}</p>
          <p className="mt-1 text-sm">⭐ {property.owner.rating} · {property.owner.listingsCount} listings</p>
        </div>

        {submitted ? (
          <p className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            Request sent! The owner will call you back shortly.
          </p>
        ) : (
          <>
            {revealed ? (
              <a
                href={`tel:${property.owner.phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 py-3 font-semibold text-primary"
              >
                <Phone className="h-5 w-5" />
                {property.owner.phone}
              </a>
            ) : (
              <Button className="w-full" onClick={() => setRevealed(true)}>
                <Phone className="h-4 w-4" />
                View Number
              </Button>
            )}
            <div>
              <label className="text-sm font-medium flex items-center gap-1 mb-2">
                <MessageCircle className="h-4 w-4" />
                Request callback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this property..."
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => setSubmitted(true)}
            >
              Send Request
            </Button>
          </>
        )}
        <p className="text-[10px] text-center text-muted-foreground">
          By contacting, you agree to {BRAND_NAME}&apos;s terms. Your number is shared only with this owner.
        </p>
      </div>
    </Modal>
  );
}
