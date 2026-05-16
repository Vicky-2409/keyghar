"use client";

import Image from "next/image";
import type { Property } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function OwnerCard({
  owner,
  onContact,
}: {
  owner: Property["owner"];
  onContact: () => void;
}) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.avatarSeed}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          <Image src={avatarUrl} alt={owner.name} fill className="object-cover" />
        </div>
        <div>
          <p className="font-bold text-lg">{owner.name}</p>
          <p className="text-sm text-muted-foreground">{owner.role}</p>
          <p className="mt-1 text-sm">
            ⭐ {owner.rating} · {owner.listingsCount} properties listed
          </p>
        </div>
      </div>
      <Button className="mt-4 w-full" onClick={onContact}>
        Contact Owner
      </Button>
    </div>
  );
}
