import {
  Dumbbell,
  Shield,
  Wifi,
  Car,
  Waves,
  TreePine,
  Zap,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/cn";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Gym: Dumbbell,
  "24/7 Security": Shield,
  "Wi-Fi": Wifi,
  "Visitor Parking": Car,
  "Swimming Pool": Waves,
  "Children's Play Area": TreePine,
  "Power Backup": Zap,
  AC: Wind,
};

export function AmenitiesGrid({ amenities }: { amenities: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {amenities.map((a) => {
        const Icon = ICON_MAP[a] ?? Shield;
        return (
          <div
            key={a}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm"
            )}
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{a}</span>
          </div>
        );
      })}
    </div>
  );
}
