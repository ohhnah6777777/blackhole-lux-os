import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, BatteryFull, ChevronRight, CircleUserRound, ExternalLink, FilePlus2, FileText, Folder, Globe2, LockKeyhole, Maximize2, MonitorCog, MoreHorizontal, PanelLeft, Plus, RefreshCw, Save, Search, Settings, ShieldCheck, Signal, SlidersHorizontal, SunMoon, Trash2, Volume2, X } from "lucide-react";
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
  const [appearance, setAppearance] = useState<"dark" | "light">("dark");
  const [wallpaper, setWallpaper] = useState<"graphite" | "void" | "frost">("graphite");
  const [windowRadius, setWindowRadius] = useState(12);
  const [proxyUrl, setProxyUrl] = useState("https://api.allorigins.win/raw?url=");

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const launch = (app: "browser" | "files" | "settings") => {
    setActiveApp(app);
    setMinimized(false);
  };

  return (
    <div className={cn("relative h-dvh w-full overflow-hidden text-foreground", appearance === "light" && "light-os", `wallpaper-${wallpaper}`)}>
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
          <WindowShell radius={windowRadius} title={activeApp === "browser" ? "Blackhole" : activeApp === "files" ? "Files" : "System Settings"} onClose={() => setActiveApp(null)} onMinimize={() => setMinimized(true)}>
            {activeApp === "browser" && <Browser proxyUrl={proxyUrl} />}
            {activeApp === "files" && <Files />}
            {activeApp === "settings" && <SystemSettings appearance={appearance} setAppearance={setAppearance} wallpaper={wallpaper} setWallpaper={setWallpaper} windowRadius={windowRadius} setWindowRadius={setWindowRadius} proxyUrl={proxyUrl} setProxyUrl={setProxyUrl} />}
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

function WindowShell({ title, children, onClose, onMinimize, radius }: { title: string; children: React.ReactNode; onClose: () => void; onMinimize: () => void; radius: number }) {
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

  return <section className={cn("animate-window-in window-shadow absolute overflow-hidden border border-border bg-card transition-[inset,width,height,border-radius] duration-200", maximized ? "inset-2" : "left-1/2 top-1/2 h-[min(760px,calc(100%-60px))] w-[min(1180px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 resize")}
    style={{ borderRadius: `${radius}px`, ...(maximized ? {} : { translate: `${position.x}px ${position.y}px` }) }}>
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

type BrowserTab = { id: number; history: (string | null)[]; index: number };

const GATEWAY_HOME = "https://rammerhead.org";

function Browser({ proxyUrl }: { proxyUrl: string }) {
  const [tabs, setTabs] = useState<BrowserTab[]>([{ id: 1, history: [null], index: 0 }]);
  const [activeId, setActiveId] = useState(1);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const url = active?.history[active.index] ?? null;
  const [input, setInput] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [key, setKey] = useState(0);
  const displayUrl = url ?? "Gateway home";
  const renderedUrl = useMemo(() => url ? `${proxyUrl}${encodeURIComponent(url)}` : GATEWAY_HOME, [proxyUrl, url]);

  const navigate = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const target = /^https?:\/\//i.test(trimmed) ? trimmed : trimmed.includes(".") && !trimmed.includes(" ") ? `https://${trimmed}` : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    setTabs((current) => current.map((tab) => tab.id === activeId ? { ...tab, history: [...tab.history.slice(0, tab.index + 1), target], index: tab.index + 1 } : tab));
    setInput(target); setKey((value) => value + 1);
  };
  const moveHistory = (amount: number) => {
    setTabs((current) => current.map((tab) => tab.id === activeId ? { ...tab, index: Math.max(0, Math.min(tab.history.length - 1, tab.index + amount)) } : tab));
    setInput(""); setKey((value) => value + 1);
  };
  const newTab = () => { const id = Date.now(); setTabs((current) => [...current, { id, history: [null], index: 0 }]); setActiveId(id); setInput(""); };
  const closeTab = (id: number) => {
    if (tabs.length === 1) { setTabs([{ id: Date.now(), history: [null], index: 0 }]); setInput(""); return; }
    const next = tabs.filter((tab) => tab.id !== id);
    const fallback = next[next.length - 1];
    setTabs(next);
    if (id === activeId && fallback) setActiveId(fallback.id);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); navigate(input); };

  return <div className="flex h-full min-h-0 bg-background">
    {sidebar && <aside className="hidden w-52 shrink-0 border-r border-border bg-card p-3 sm:block">
      <div className="mb-5 flex items-center justify-between px-2"><span className="text-xs font-semibold">Tabs</span><Button aria-label="New tab" variant="chrome" size="icon" className="size-7" onClick={newTab}><Plus /></Button></div>
      {tabs.map((tab, tabIndex) => <div key={tab.id} className={cn("group mb-1 flex items-center rounded-md", tab.id === activeId && "bg-accent")}><button onClick={() => { setActiveId(tab.id); setInput(""); }} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-xs"><Globe2 className="size-3.5 shrink-0"/><span className="truncate">{tab.history[tab.index]?.replace(/^https?:\/\/(www\.)?/, "") || `New Tab ${tabIndex + 1}`}</span></button><Button aria-label="Close tab" variant="chrome" size="icon" className="mr-1 size-6 opacity-0 group-hover:opacity-100" onClick={() => closeTab(tab.id)}><X /></Button></div>)}
      <p className="mb-2 mt-6 px-3 text-[10px] uppercase text-muted-foreground">Pinned</p>
      <button onClick={() => navigate("https://en.wikipedia.org")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"><span className="font-serif">W</span> Wikipedia</button>
      <button onClick={() => navigate("https://developer.mozilla.org")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"><span className="font-mono">MDN</span> Developer</button>
    </aside>}
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="glass-panel flex h-14 shrink-0 items-center gap-1 border-b border-border px-3">
        <Button aria-label="Back" disabled={!active || active.index === 0} variant="chrome" size="icon" className="size-8" onClick={() => moveHistory(-1)}><ArrowLeft /></Button>
        <Button aria-label="Forward" disabled={!active || active.index === active.history.length - 1} variant="chrome" size="icon" className="size-8" onClick={() => moveHistory(1)}><ArrowRight /></Button>
        <Button variant="chrome" size="icon" className="size-8" onClick={() => setKey((value) => value + 1)}><RefreshCw /></Button>
        <form onSubmit={submit} className="mx-auto flex h-9 w-full max-w-2xl items-center rounded-full border border-border bg-secondary px-4 focus-within:border-muted-foreground">
          <LockKeyhole className="mr-2 size-3 text-muted-foreground" />
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={displayUrl} className="min-w-0 flex-1 bg-transparent text-center text-xs outline-none placeholder:text-muted-foreground" />
        </form>
        <Button variant="chrome" size="icon" className="size-8" onClick={() => setSidebar((value) => !value)}><PanelLeft /></Button>
        <span aria-label="Gateway proxy active" title="Gateway proxy active" className="flex size-8 items-center justify-center rounded-md text-muted-foreground"><ShieldCheck className="size-4" /></span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <iframe key={`${key}-${renderedUrl}`} title="Blackhole browser content" src={renderedUrl} className="block h-full w-full border-0 bg-background" sandbox="allow-forms allow-popups allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
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

type FsItem = { id: number; name: string; type: "folder" | "file"; parent: string; content?: string };

function Files() {
  const [items, setItems] = useState<FsItem[]>(() => [
    ...["Documents", "Downloads", "Pictures", "Games"].map<FsItem>((name, index) => ({ id: index + 1, name, type: "folder", parent: "Home" })),
    { id: 10, name: "Welcome.txt", type: "file", parent: "Documents", content: "Welcome to Blackhole OS.\n\nThis file is yours to edit." },
  ]);
  const [path, setPath] = useState<string[]>(["Home"]);
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState<FsItem | null>(null);
  const current = path[path.length - 1] ?? "Home";
  const visible = items.filter((item) => item.parent === current);
  const createFile = () => { const count = items.filter((item) => item.parent === current && item.type === "file").length + 1; setItems((all) => [...all, { id: Date.now(), name: `Untitled ${count}.txt`, type: "file", parent: current, content: "" }]); };
  const remove = () => { if (selected === null) return; const target = items.find((item) => item.id === selected); setItems((all) => all.filter((item) => item.id !== selected && item.parent !== target?.name)); setSelected(null); };
  return <div className="relative flex h-full bg-background"><aside className="w-52 border-r border-border bg-card p-4"><p className="mb-4 text-[10px] uppercase text-muted-foreground">Favorites</p>{["Home", "Documents", "Downloads"].map((item) => <button key={item} onClick={() => { setPath(item === "Home" ? ["Home"] : ["Home", item]); setSelected(null); }} className="mb-1 block w-full rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground">{item}</button>)}</aside><div className="min-w-0 flex-1 p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><nav className="flex items-center text-sm">{path.map((part, index) => <span key={part} className="flex items-center"><button onClick={() => setPath(path.slice(0, index + 1))} className={cn("rounded px-1 py-1 hover:bg-accent", index < path.length - 1 && "text-muted-foreground")}>{part}</button>{index < path.length - 1 && <ChevronRight className="size-3 text-muted-foreground"/>}</span>)}</nav><div className="flex gap-2"><Button variant="outline" size="sm" onClick={createFile}><FilePlus2/>Create New File</Button><Button variant="outline" size="sm" disabled={selected === null} onClick={remove}><Trash2/>Delete</Button></div></div><p className="mb-5 text-xs text-muted-foreground">{visible.length} items · Blackhole Drive</p><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{visible.map((item) => <div key={item.id} className={cn("relative rounded-lg border bg-card transition-colors hover:bg-accent", selected === item.id ? "border-foreground" : "border-border")}><button onClick={() => item.type === "folder" ? (setPath([...path, item.name]), setSelected(null)) : setEditing(item)} className="block w-full p-4 text-left">{item.type === "folder" ? <Folder className="mb-8 size-7 fill-foreground"/> : <FileText className="mb-8 size-7"/>}<p className="truncate text-xs font-medium">{item.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.type === "folder" ? "Folder" : "Text document"}</p></button><button aria-label={`Select ${item.name}`} onClick={() => setSelected(selected === item.id ? null : item.id)} className={cn("absolute right-2 top-2 size-4 rounded-full border border-muted-foreground hover:border-foreground", selected === item.id && "bg-foreground")}/></div>)}</div></div>{editing && <Notepad item={editing} onClose={() => setEditing(null)} onSave={(content) => { setItems((all) => all.map((item) => item.id === editing.id ? { ...item, content } : item)); setEditing(null); }}/>}</div>;
}

function Notepad({ item, onClose, onSave }: { item: FsItem; onClose: () => void; onSave: (content: string) => void }) {
  const [content, setContent] = useState(item.content ?? "");
  return <div className="absolute inset-6 z-20 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"><header className="flex h-11 items-center justify-between border-b border-border px-4"><div className="flex items-center gap-2 text-xs"><FileText className="size-4"/>{item.name}</div><div className="flex gap-1"><Button variant="chrome" size="sm" onClick={() => onSave(content)}><Save/>Save</Button><Button aria-label="Close Notepad" variant="chrome" size="icon" className="size-8" onClick={onClose}><X/></Button></div></header><textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-0 flex-1 resize-none bg-background p-6 font-mono text-sm leading-6 outline-none" /></div>;
}

type AppearanceProps = { appearance: "dark" | "light"; setAppearance: (value: "dark" | "light") => void; wallpaper: "graphite" | "void" | "frost"; setWallpaper: (value: "graphite" | "void" | "frost") => void; windowRadius: number; setWindowRadius: (value: number) => void; proxyUrl: string; setProxyUrl: (value: string) => void };

function SystemSettings({ appearance, setAppearance, wallpaper, setWallpaper, windowRadius, setWindowRadius, proxyUrl, setProxyUrl }: AppearanceProps) {
  const [section, setSection] = useState<"Appearance" | "Browser" | "Privacy" | "About">("Appearance");
  return <div className="flex h-full bg-background"><aside className="w-56 border-r border-border bg-card p-4"><div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-secondary p-3"><CircleUserRound className="size-8"/><div><p className="text-xs font-medium">Blackhole User</p><p className="text-[10px] text-muted-foreground">Local account</p></div></div>{["Appearance", "Browser", "Privacy", "About"].map((item) => <button key={item} onClick={() => setSection(item as typeof section)} className={cn("mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-xs", section === item ? "bg-accent" : "text-muted-foreground hover:bg-accent")}><span>{item}</span><ChevronRight className="size-3"/></button>)}</aside><div className="min-w-0 flex-1 overflow-y-auto p-8"><h2 className="text-xl font-medium">{section}</h2>{section === "Appearance" && <div className="mt-7 max-w-2xl space-y-8"><section><p className="mb-3 text-xs font-medium">Color mode</p><div className="flex gap-2">{(["dark", "light"] as const).map((mode) => <Button key={mode} variant={appearance === mode ? "default" : "outline"} onClick={() => setAppearance(mode)}><SunMoon/>{mode === "dark" ? "Dark Mode" : "Light Mode"}</Button>)}</div></section><section><p className="mb-3 text-xs font-medium">Wallpaper</p><div className="grid grid-cols-3 gap-3">{(["graphite", "void", "frost"] as const).map((choice) => <button key={choice} onClick={() => setWallpaper(choice)} className={cn("overflow-hidden rounded-lg border p-1 text-left", wallpaper === choice ? "border-foreground" : "border-border hover:border-muted-foreground")}><span className={cn("block aspect-video rounded-md", `wallpaper-${choice}`)}/><span className="block p-2 text-xs capitalize">{choice}</span></button>)}</div></section><section><div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium">Window corner radius</p><span className="text-xs text-muted-foreground">{windowRadius}px</span></div><input aria-label="Window corner radius" type="range" min="0" max="24" value={windowRadius} onChange={(event) => setWindowRadius(Number(event.target.value))} className="w-full accent-current"/></section></div>}{section === "Browser" && <div className="mt-7 max-w-2xl"><label className="text-xs font-medium" htmlFor="proxy-url">Proxy URL prefix</label><p className="mb-3 mt-1 text-xs text-muted-foreground">The destination URL is encoded and appended to this address.</p><input id="proxy-url" value={proxyUrl} onChange={(event) => setProxyUrl(event.target.value)} className="h-10 w-full rounded-md border border-input bg-secondary px-3 text-sm outline-none focus:border-foreground"/><p className="mt-4 text-xs text-muted-foreground">Use the shield button in Blackhole Browser to switch between proxy and direct loading. Sites that prevent embedding can be opened with the external-link button.</p></div>}{section === "Privacy" && <div className="mt-7 max-w-xl text-sm text-muted-foreground">Browser tabs, file edits, and appearance settings stay in this session.</div>}{section === "About" && <div className="mt-7"><p className="text-sm">Blackhole OS 1.0</p><p className="mt-1 text-xs text-muted-foreground">Web edition</p></div>}</div></div>;
}

function Dock({ activeApp, minimized, onLaunch }: { activeApp: string | null; minimized: boolean; onLaunch: (app: "browser" | "files" | "settings") => void }) {
  const apps = [{ id: "browser" as const, label: "Blackhole Browser", icon: Globe2 }, { id: "files" as const, label: "File Manager", icon: Folder }, { id: "settings" as const, label: "System Settings", icon: Settings }];
  return <TooltipProvider delayDuration={150}><nav aria-label="Applications" className="glass-panel absolute bottom-4 left-1/2 z-[80] flex h-16 -translate-x-1/2 items-center gap-2 rounded-2xl border border-border px-2.5 shadow-2xl">{apps.map(({ id, label, icon: Icon }) => <Tooltip key={id}><TooltipTrigger asChild><Button aria-label={label} variant="dock" size="icon" onClick={() => onLaunch(id)} className="group relative size-11 rounded-xl transition-all duration-200 hover:-translate-y-2 hover:scale-125 hover:shadow-2xl"><Icon className="size-5"/><span className={cn("absolute -bottom-2.5 size-1 rounded-full bg-foreground transition-opacity", activeApp === id ? "opacity-100" : "opacity-0", minimized && activeApp === id && "animate-pulse")} /></Button></TooltipTrigger><TooltipContent side="top" sideOffset={14}>{label}</TooltipContent></Tooltip>)}</nav></TooltipProvider>;
}
