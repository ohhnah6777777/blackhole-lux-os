import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, BatteryFull, ChevronRight, CircleUserRound, Folder, Globe2, LockKeyhole, Maximize2, MonitorCog, MoreHorizontal, PanelLeft, Plus, RefreshCw, Search, Settings, ShieldCheck, Signal, SlidersHorizontal, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Blackhole OS — Web Desktop" },
    { name: "description", content: "Experience Blackhole OS, a premium monochrome web desktop and browser." },
    { property: "og:title", content: "Blackhole OS — Web Desktop" },
    { property: "og:description", content: "A premium monochrome web desktop and browser." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  const [activeApp, setActiveApp] = useState<"browser" | "files" | "settings" | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const launch = (app: "browser" | "files" | "settings") => {
    setActiveApp(app);
    setMinimized(false);
  };

  return (
    <div className="desktop-wallpaper relative h-dvh w-full overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(oklch(1_0_0/0.018)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.018)_1px,transparent_1px)] [background-size:64px_64px]" />
      <header className="glass-panel relative z-50 flex h-9 items-center justify-between border-b border-border/70 px-4 text-xs">
        <div className="flex items-center gap-5">
          <button className="font-semibold tracking-normal" onClick={() => setActiveApp(null)}>●</button>
          <span className="font-semibold">Blackhole OS</span>
          <span className="hidden text-muted-foreground sm:block">Desktop</span>
          <span className="hidden text-muted-foreground sm:block">Window</span>
        </div>
        <button onClick={() => setControlOpen((value) => !value)} className="flex items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-accent">
          <Signal className="size-3.5" /><Volume2 className="size-3.5" /><BatteryFull className="size-4" />
          <span>{time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
          <span className="font-medium tabular-nums">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </button>
      </header>

      {controlOpen && <ControlCenter />}

      <main className="absolute inset-x-0 bottom-0 top-9">
        <div className="absolute left-8 top-8 hidden flex-col items-center gap-2 text-xs text-muted-foreground md:flex">
          <div className="flex size-14 items-center justify-center rounded-md border border-border bg-secondary/70 backdrop-blur-xl"><MonitorCog className="size-7" /></div>
          <span>System</span>
        </div>

        {activeApp && !minimized && (
          <WindowShell title={activeApp === "browser" ? "Blackhole" : activeApp === "files" ? "Files" : "System Settings"} onClose={() => setActiveApp(null)} onMinimize={() => setMinimized(true)}>
            {activeApp === "browser" && <Browser />}
            {activeApp === "files" && <Files />}
            {activeApp === "settings" && <SystemSettings />}
          </WindowShell>
        )}
      </main>

      <Dock activeApp={activeApp} minimized={minimized} onLaunch={launch} />
    </div>
  );
}

function ControlCenter() {
  return <aside className="glass-panel animate-window-in absolute right-3 top-12 z-[70] w-72 rounded-xl border border-border p-3 shadow-2xl">
    <div className="grid grid-cols-2 gap-2">
      {[{ icon: Signal, name: "Wi-Fi", value: "Connected" }, { icon: ShieldCheck, name: "Privacy", value: "Protected" }].map(({ icon: Icon, name, value }) => (
        <div key={name} className="rounded-lg border border-border bg-secondary p-3"><Icon className="mb-4 size-4" /><p className="text-xs font-medium">{name}</p><p className="text-[10px] text-muted-foreground">{value}</p></div>
      ))}
    </div>
    <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-secondary p-3"><Volume2 className="size-4"/><div className="h-1 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 bg-foreground" /></div></div>
  </aside>;
}

function WindowShell({ title, children, onClose, onMinimize }: { title: string; children: React.ReactNode; onClose: () => void; onMinimize: () => void }) {
  const [maximized, setMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    drag.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPosition({ x: drag.current.startX + event.clientX - drag.current.x, y: Math.max(-20, drag.current.startY + event.clientY - drag.current.y) });
  };

  return <section className={cn("animate-window-in window-shadow absolute overflow-hidden border border-border bg-card transition-[inset,width,height,border-radius] duration-200", maximized ? "inset-2 rounded-lg" : "left-1/2 top-1/2 h-[min(760px,calc(100%-60px))] w-[min(1180px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 resize rounded-xl")}
    style={maximized ? undefined : { translate: `${position.x}px ${position.y}px` }}>
    <div onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; }} onDoubleClick={() => setMaximized((value) => !value)} className="flex h-11 cursor-default items-center border-b border-border bg-secondary/60 px-4 backdrop-blur-xl">
      <div className="flex gap-2" onDoubleClick={(event) => event.stopPropagation()}>
        <button aria-label="Close window" onClick={onClose} className="group flex size-3 items-center justify-center rounded-full bg-muted-foreground/80 hover:bg-destructive"><X className="size-2 opacity-0 group-hover:opacity-100" /></button>
        <button aria-label="Minimize window" onClick={onMinimize} className="flex size-3 items-center justify-center rounded-full bg-muted-foreground/50 hover:bg-foreground" />
        <button aria-label="Maximize window" onClick={() => setMaximized((value) => !value)} className="flex size-3 items-center justify-center rounded-full border border-muted-foreground/60 hover:bg-foreground" />
      </div>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">{title}</span>
    </div>
    <div className="h-[calc(100%-44px)]">{children}</div>
  </section>;
}

function Browser() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [sidebar, setSidebar] = useState(true);
  const [key, setKey] = useState(0);
  const displayUrl = url ?? "blackhole://newtab";
  const proxiedUrl = useMemo(() => url ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : "", [url]);

  const navigate = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const target = /^https?:\/\//i.test(trimmed) ? trimmed : trimmed.includes(".") && !trimmed.includes(" ") ? `https://${trimmed}` : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    setUrl(target); setInput(target); setKey((value) => value + 1);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); navigate(input); };

  return <div className="flex h-full min-h-0 bg-background">
    {sidebar && <aside className="hidden w-52 shrink-0 border-r border-border bg-card p-3 sm:block">
      <div className="mb-5 flex items-center justify-between px-2"><span className="text-xs font-semibold">Spaces</span><Button variant="chrome" size="icon" className="size-7"><Plus /></Button></div>
      <button onClick={() => { setUrl(null); setInput(""); }} className="flex w-full items-center gap-2 rounded-md bg-accent px-3 py-2 text-left text-xs"><Globe2 className="size-3.5"/>New Tab</button>
      <p className="mb-2 mt-6 px-3 text-[10px] uppercase text-muted-foreground">Pinned</p>
      <button onClick={() => navigate("https://en.wikipedia.org")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"><span className="font-serif">W</span> Wikipedia</button>
      <button onClick={() => navigate("https://developer.mozilla.org")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"><span className="font-mono">MDN</span> Developer</button>
    </aside>}
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-1 border-b border-border px-3">
        <Button variant="chrome" size="icon" className="size-8" onClick={() => history.back()}><ArrowLeft /></Button>
        <Button variant="chrome" size="icon" className="size-8" onClick={() => history.forward()}><ArrowRight /></Button>
        <Button variant="chrome" size="icon" className="size-8" onClick={() => setKey((value) => value + 1)}><RefreshCw /></Button>
        <form onSubmit={submit} className="mx-auto flex h-9 w-full max-w-2xl items-center rounded-full border border-border bg-secondary px-4 focus-within:border-muted-foreground">
          <LockKeyhole className="mr-2 size-3 text-muted-foreground" />
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={displayUrl} className="min-w-0 flex-1 bg-transparent text-center text-xs outline-none placeholder:text-muted-foreground" />
        </form>
        <Button variant="chrome" size="icon" className="size-8" onClick={() => setSidebar((value) => !value)}><PanelLeft /></Button>
        <Button variant="chrome" size="icon" className="size-8"><MoreHorizontal /></Button>
      </div>
      <div className="min-h-0 flex-1">
        {url ? <iframe key={key} title="Blackhole browser content" src={proxiedUrl} className="h-full w-full bg-background" sandbox="allow-forms allow-popups allow-scripts allow-same-origin" referrerPolicy="no-referrer" /> : <NewTab onNavigate={navigate} />}
      </div>
    </div>
  </div>;
}

function NewTab({ onNavigate }: { onNavigate: (value: string) => void }) {
  const [query, setQuery] = useState("");
  return <div className="flex h-full flex-col items-center justify-center px-6 pb-12">
    <div className="mb-8 flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-2xl"><div className="size-5 rounded-full border-2 border-foreground shadow-[inset_0_0_0_4px_var(--background)]" /></div>
    <h1 className="mb-2 text-2xl font-medium">Blackhole</h1><p className="mb-8 text-sm text-muted-foreground">Where would you like to go?</p>
    <form onSubmit={(event) => { event.preventDefault(); onNavigate(query); }} className="flex h-12 w-full max-w-xl items-center rounded-full border border-border bg-card px-5 shadow-xl focus-within:border-muted-foreground"><Search className="mr-3 size-4 text-muted-foreground"/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the web" className="flex-1 bg-transparent text-sm outline-none"/></form>
    <div className="mt-8 grid grid-cols-3 gap-3">
      {[{ label: "Wikipedia", mark: "W", url: "https://en.wikipedia.org" }, { label: "MDN", mark: "M", url: "https://developer.mozilla.org" }, { label: "Archive", mark: "A", url: "https://archive.org" }].map((site) => <button key={site.label} onClick={() => onNavigate(site.url)} className="group flex w-24 flex-col items-center gap-2 rounded-lg p-3 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground"><span className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary font-medium text-foreground transition-transform group-hover:scale-105">{site.mark}</span>{site.label}</button>)}
    </div>
  </div>;
}

function Files() {
  const folders = ["Documents", "Downloads", "Pictures", "Projects"];
  return <div className="flex h-full bg-background"><aside className="w-52 border-r border-border bg-card p-4"><p className="mb-4 text-[10px] uppercase text-muted-foreground">Favorites</p>{["Recents", "Desktop", "Downloads"].map((item) => <div key={item} className="mb-1 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">{item}</div>)}</aside><div className="flex-1 p-7"><div className="mb-7 flex items-center justify-between"><div><h2 className="text-lg font-medium">Home</h2><p className="text-xs text-muted-foreground">Blackhole Drive</p></div><Search className="size-4 text-muted-foreground"/></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{folders.map((folder) => <div key={folder} className="rounded-lg border border-border bg-card p-4"><Folder className="mb-8 size-7 fill-foreground text-foreground"/><p className="text-xs font-medium">{folder}</p><p className="mt-1 text-[10px] text-muted-foreground">Empty folder</p></div>)}</div></div></div>;
}

function SystemSettings() {
  return <div className="flex h-full bg-background"><aside className="w-56 border-r border-border bg-card p-4"><div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-secondary p-3"><CircleUserRound className="size-8"/><div><p className="text-xs font-medium">Blackhole User</p><p className="text-[10px] text-muted-foreground">Local account</p></div></div>{["Appearance", "Network", "Privacy", "About"].map((item, index) => <div key={item} className={cn("mb-1 flex items-center justify-between rounded-md px-3 py-2 text-xs", index === 0 ? "bg-accent" : "text-muted-foreground hover:bg-accent")}><span>{item}</span><ChevronRight className="size-3"/></div>)}</aside><div className="flex-1 p-8"><h2 className="text-xl font-medium">Appearance</h2><p className="mt-1 text-xs text-muted-foreground">Personalize the Blackhole desktop.</p><div className="mt-8 max-w-xl border-t border-border"><SettingRow icon={SlidersHorizontal} title="Interface" detail="Dark · Monochrome"/><SettingRow icon={Maximize2} title="Window behavior" detail="Animate controls"/><SettingRow icon={Globe2} title="Default browser" detail="Blackhole"/></div></div></div>;
}

function SettingRow({ icon: Icon, title, detail }: { icon: typeof Settings; title: string; detail: string }) {
  return <div className="flex items-center gap-4 border-b border-border py-5"><div className="flex size-9 items-center justify-center rounded-md bg-secondary"><Icon className="size-4"/></div><div className="flex-1"><p className="text-sm">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div><ChevronRight className="size-4 text-muted-foreground"/></div>;
}

function Dock({ activeApp, minimized, onLaunch }: { activeApp: string | null; minimized: boolean; onLaunch: (app: "browser" | "files" | "settings") => void }) {
  const apps = [{ id: "browser" as const, label: "Blackhole Browser", icon: Globe2 }, { id: "files" as const, label: "File Manager", icon: Folder }, { id: "settings" as const, label: "System Settings", icon: Settings }];
  return <TooltipProvider delayDuration={150}><nav aria-label="Applications" className="glass-panel absolute bottom-4 left-1/2 z-[80] flex h-16 -translate-x-1/2 items-center gap-2 rounded-2xl border border-border px-2.5 shadow-2xl">{apps.map(({ id, label, icon: Icon }) => <Tooltip key={id}><TooltipTrigger asChild><Button aria-label={label} variant="dock" size="icon" onClick={() => onLaunch(id)} className="group relative size-11 rounded-xl transition-all duration-200 hover:-translate-y-2 hover:scale-125 hover:shadow-2xl"><Icon className="size-5"/><span className={cn("absolute -bottom-2.5 size-1 rounded-full bg-foreground transition-opacity", activeApp === id ? "opacity-100" : "opacity-0", minimized && activeApp === id && "animate-pulse")} /></Button></TooltipTrigger><TooltipContent side="top" sideOffset={14}>{label}</TooltipContent></Tooltip>)}</nav></TooltipProvider>;
}
