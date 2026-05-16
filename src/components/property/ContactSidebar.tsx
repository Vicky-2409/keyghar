"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import type { Property } from "@/lib/types";
import { ContactModal } from "./ContactModal";
import { useContactAccessContext } from "@/providers/ContactAccessProvider";

export function ContactSidebar({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { isUnlocked, requestContactAccess } = useContactAccessContext();

  const handleViewContact = () => {
    requestContactAccess(() => setOpen(true));
  };

  return (
    <>
      <div className="sticky top-20 rounded border border-[#e0e0e0] bg-white p-5 shadow-sm">
        <h3 className="text-center text-sm font-bold text-[#333]">Contact Owner</h3>
        <p className="mt-1 text-center text-xs text-[#888]">
          {isUnlocked ? "Get owner details instantly" : "Subscribe to unlock · ₹49/month"}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-[#555]">Mobile Number</label>
            <div className="mt-1 flex overflow-hidden rounded border border-[#ccc]">
              <span className="flex items-center border-r border-[#ccc] bg-[#f5f5f5] px-2 text-sm text-[#666]">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile"
                className="flex-1 px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#555]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="mt-1 w-full rounded border border-[#ccc] px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleViewContact}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary py-3 text-sm font-bold uppercase text-white hover:bg-[#004d8c]"
          >
            {!isUnlocked && <Lock className="h-4 w-4" />}
            {isUnlocked ? "View Contact" : "Subscribe & View Contact"}
          </button>
        </div>

        <div className="mt-4 space-y-1 border-t border-[#eee] pt-4 text-xs text-[#666]">
          {isUnlocked ? (
            <>
              <p className="font-semibold text-[#333]">{property.owner.name}</p>
              <p>{property.owner.role}</p>
              <p>Rating: {property.owner.rating} / 5</p>
            </>
          ) : (
            <p className="text-center text-[#888]">Owner details hidden — subscribe to view</p>
          )}
        </div>
      </div>
      <ContactModal open={open} onClose={() => setOpen(false)} property={property} />
    </>
  );
}
