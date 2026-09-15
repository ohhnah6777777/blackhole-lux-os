import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  CalendarDays,
  Clock3,
  Folder,
  Gamepad2,
  Globe,
  Mail,
  Music4,
  Settings,
  ShoppingBag,
  StickyNote,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AppId =
  | "browser"
  | "files"
  | "settings"
  | "appstore"
  | "notes"
  | "calculator"
  | "music"
  | "mail"
  | "clock"
  | "calendar"
  | "terminal"
  | "arcade";

export type AppMeta = {
  id: AppId;
  name: string;
  icon: LucideIcon;
  /** rich multi-layered gradient for the icon tile */
  tile: string;
  glow: string;
  system?: boolean;
  blurb?: string;
};

export const APPS: Record<AppId, AppMeta> = {
  browser: {
    id: "browser",
    name: "Browser",
    icon: Globe,
    tile: "bg-[radial-gradient(circle_at_28%_22%,#7dd3fc,transparent_55%),radial-gradient(circle_at_75%_28%,#fbbf24,transparent_50%),radial-gradient(circle_at_70%_80%,#34d399,transparent_55%),linear-gradient(145deg,#2563eb,#1e3a8a)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#2563ebaa]",
    system: true,
    blurb: "Fast, unblocked web access",
  },
  files: {
    id: "files",
    name: "Files",
    icon: Folder,
    tile: "bg-[linear-gradient(160deg,#fde68a,#f59e0b_45%,#b45309)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#f59e0baa]",
    system: true,
    blurb: "Browse and edit your documents",
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: Settings,
    tile: "bg-[linear-gradient(150deg,#f1f5f9,#94a3b8_45%,#334155)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#94a3b8aa]",
    system: true,
    blurb: "Tune your system",
  },
  appstore: {
    id: "appstore",
    name: "App Store",
    icon: ShoppingBag,
    tile: "bg-[radial-gradient(circle_at_30%_25%,#f0abfc,transparent_55%),linear-gradient(150deg,#a855f7,#4f46e5_60%,#1e1b4b)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#a855f7aa]",
    system: true,
    blurb: "Install more apps",
  },
  notes: {
    id: "notes",
    name: "Notes",
    icon: StickyNote,
    tile: "bg-[linear-gradient(150deg,#fef08a,#facc15_50%,#ca8a04)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#facc15aa]",
    blurb: "Quick scratch pad",
  },
  calculator: {
    id: "calculator",
    name: "Calculator",
    icon: Calculator,
    tile: "bg-[linear-gradient(150deg,#fb923c,#ea580c_55%,#7c2d12)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#ea580caa]",
    blurb: "Everyday math",
  },
  music: {
    id: "music",
    name: "Music",
    icon: Music4,
    tile: "bg-[linear-gradient(150deg,#fda4af,#e11d48_55%,#881337)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#e11d48aa]",
    blurb: "Ambient sound player",
  },
  mail: {
    id: "mail",
    name: "Mail",
    icon: Mail,
    tile: "bg-[linear-gradient(150deg,#7dd3fc,#0284c7_55%,#0c4a6e)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#0284c7aa]",
    blurb: "Read your inbox",
  },
  clock: {
    id: "clock",
    name: "Clock",
    icon: Clock3,
    tile: "bg-[linear-gradient(150deg,#a5b4fc,#4f46e5_55%,#1e1b4b)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#4f46e5aa]",
    blurb: "World clock and timers",
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    icon: CalendarDays,
    tile: "bg-[linear-gradient(150deg,#fca5a5,#dc2626_55%,#7f1d1d)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#dc2626aa]",
    blurb: "Plan your week",
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: Terminal,
    tile: "bg-[linear-gradient(150deg,#86efac,#16a34a_55%,#052e16)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#16a34aaa]",
    blurb: "Command line playground",
  },
  arcade: {
    id: "arcade",
    name: "Arcade",
    icon: Gamepad2,
    tile: "bg-[radial-gradient(circle_at_30%_25%,#5eead4,transparent_55%),linear-gradient(150deg,#06b6d4,#0f766e_60%,#042f2e)]",
    glow: "group-hover:shadow-[0_10px_30px_-6px_#06b6d4aa]",
    blurb: "Small games collection",
  },
};

export const STORE_APPS: AppId[] = [
  "notes",
  "calculator",
  "music",
  "mail",
  "clock",
  "calendar",
  "terminal",
  "arcade",
];

export function AppIcon({ app, className }: { app: AppMeta; className?: string }) {
  const Icon = app.icon;
  return (
    <span
      className={cn(
        "relative flex items-center justify-center rounded-2xl shadow-[0_8px_20px_-8px_oklch(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-white/15 transition-all duration-200 group-hover:scale-105",
        app.tile,
        app.glow,
        className ?? "size-12",
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,oklch(1_0_0/0.28),transparent_55%)]" />
      <Icon className="relative size-1/2 text-white drop-shadow-[0_1px_2px_oklch(0_0_0/0.55)]" strokeWidth={2.1} />
    </span>
  );
}
