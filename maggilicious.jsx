import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  UtensilsCrossed,
  Flame,
  Timer as TimerIcon,
  ShoppingCart,
  Moon,
  Sun,
  Play,
  Pause,
  RotateCcw,
  Clipboard,
  Download,
  Trash2,
  Gamepad2,
  Heart,
  Star,
  ShoppingBag,
  Wand2,
  Palette,
  Menu,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/**
 * MAGGILICIOUS.COM — "Midnight Noodle Club & Tiny Joys Lab"
 * Single-file React SPA with TailwindCSS, Framer Motion, Lucide Icons, and Recharts
 * All client-side. No external APIs. Built to showcase playful UX and interactive widgets.
 */

// ---------- Small UI primitives (Button, Badge, Card) ----------
const cn = (...c) => c.filter(Boolean).join(" ");

function Button({ as: Comp = "button", className = "", children, ...props }) {
  return (
    <Comp
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
        "bg-amber-500 text-neutral-900 hover:bg-amber-400 active:translate-y-[1px]",
        "shadow-sm shadow-amber-500/30 transition",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

function GhostButton({ className = "", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium",
        "bg-transparent text-amber-300 hover:text-amber-200 border border-amber-300/30 hover:border-amber-200/50",
        "transition"
      , className)}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border border-amber-300/40",
      "bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
      "text-amber-200 shadow-sm shadow-amber-500/10",
      className
    )}>{children}</span>
  );
}

function Card({ className = "", children }) {
  return (
    <div className={cn(
      "rounded-3xl border border-white/10 bg-white/5 backdrop-blur",
      "shadow-lg shadow-neutral-950/30 dark:shadow-black/50",
      className
    )}>
      {children}
    </div>
  );
}

// ---------- Utilities ----------
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
};

function useOscBeep() {
  const ctxRef = useRef(null);
  useEffect(() => () => { try { ctxRef.current?.close(); } catch {} }, []);
  return (duration = 0.25, freq = 880) => {
    try {
      const ctx = ctxRef.current ?? new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = freq; gain.gain.value = 0.05;
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  };
}

function NoodleLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#g)" strokeWidth="6" strokeLinecap="round">
        <path d="M10 78c40-40 70-30 90-10" />
        <path d="M14 94c50-50 90-30 104-4" />
        <path d="M22 110c46-42 84-25 94-2" />
      </g>
      <circle cx="96" cy="34" r="10" fill="url(#g)" />
    </svg>
  );
}

// ---------- Header / Nav ----------
function Header({ onToggleMenu, dark, setDark }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-neutral-900/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <NoodleLogo />
          <div>
            <div className="text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition">maggilicious</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">midnight noodle club</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          {[
            ["Menu", "#menu"],
            ["Experience", "#experience"],
            ["Lab", "#lab"],
            ["Game", "#game"],
            ["Community", "#community"],
            ["Shop", "#shop"],
            ["About", "#about"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="hover:text-amber-300 transition">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <GhostButton onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun size={16}/> : <Moon size={16}/>}<span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
          </GhostButton>
          <GhostButton className="md:hidden" onClick={onToggleMenu} aria-label="Open menu"><Menu size={18}/></GhostButton>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="mx-4 mt-20 rounded-3xl border border-white/10 bg-neutral-900/95 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3"><NoodleLogo size={32}/><div className="font-bold">maggilicious</div></div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10"><X/></button>
            </div>
            <div className="mt-4 grid gap-3 text-lg">
              {[
                ["Menu", "#menu"],
                ["Experience", "#experience"],
                ["Lab", "#lab"],
                ["Game", "#game"],
                ["Community", "#community"],
                ["Shop", "#shop"],
                ["About", "#about"],
              ].map(([label, href]) => (
                <a key={label} href={href} onClick={onClose} className="rounded-xl px-3 py-2 hover:bg-white/10">{label}</a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{background:"radial-gradient(closest-side, rgba(250,204,21,0.25), rgba(251,146,60,0.15), transparent)"}}/>
        <div className="absolute -bottom-40 right-1/3 h-[36rem] w-[36rem] rounded-full blur-3xl" style={{background:"radial-gradient(closest-side, rgba(239,68,68,0.22), rgba(245,158,11,0.12), transparent)"}}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <Badge>open late · cozy · a bit silly</Badge>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Maggilicious
          </motion.h1>
          <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="max-w-2xl text-white/80">
            A whimsical midnight noodle club where comfort food, micro‑joys, and playful tools meet. Cook a bowl, craft a vibe, play a tiny game, and leave a little happier.
          </motion.p>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href="#lab"><Wand2 size={16}/> Open the Noodle Lab</Button>
            <GhostButton as="a" href="#menu"><UtensilsCrossed size={16}/> Explore Menu</GhostButton>
            <GhostButton as="a" href="#game"><Gamepad2 size={16}/> Play a Mini‑Game</GhostButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Experience widgets ----------
function BoilTimer() {
  const beep = useOscBeep();
  const MODES = {
    "Al Dente": 120,
    Classic: 180,
    Soupy: 240,
  };
  const [mode, setMode] = useState("Classic");
  const [remain, setRemain] = useState(MODES[mode]);
  const [running, setRunning] = useState(false);
  useEffect(() => setRemain(MODES[mode]), [mode]);
  useEffect(() => {
    if (!running) return;
    if (remain <= 0) { setRunning(false); beep(0.35, 1200); return; }
    const id = setInterval(() => setRemain((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running, remain, beep]);
  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90 font-semibold"><TimerIcon size={18}/><span>Boil Timer</span></div>
        <div className="flex gap-2">
          {Object.keys(MODES).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cn("text-xs px-3 py-1 rounded-full border transition",
              m === mode ? "bg-amber-400 text-neutral-900 border-amber-300" : "border-white/10 text-white/70 hover:text-white")}>{m}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-6xl font-black tracking-tight tabular-nums">{mm}:{ss}</div>
        <div className="flex gap-2">
          <Button onClick={() => setRunning((r) => !r)} className="min-w-[7.5rem]">
            {running ? <><Pause size={16}/> Pause</> : <><Play size={16}/> Start</>}
          </Button>
          <GhostButton onClick={() => { setRunning(false); setRemain(MODES[mode]); }}><RotateCcw size={16}/> Reset</GhostButton>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/60">Tip: lift at {mode === "Al Dente" ? "a slight bite" : mode === "Classic" ? "springy" : "soft"} and rinse if you like it less starchy.</p>
    </Card>
  );
}

function DoodleCanvas() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [width, setWidth] = useState(6);
  const [curve, setCurve] = useState(0.5);
  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    cvs.width = rect.width * dpr; cvs.height = rect.height * dpr;
    const ctx = cvs.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
  });
  const start = (x, y) => {
    const cvs = canvasRef.current; const ctx = cvs.getContext("2d");
    setDrawing(true); ctx.beginPath(); ctx.moveTo(x, y);
  };
  const move = (x, y) => {
    if (!drawing) return; const cvs = canvasRef.current; const ctx = cvs.getContext("2d");
    ctx.strokeStyle = `hsl(${40 + Math.sin(y/50)*15}, 90%, 55%)`;
    ctx.lineWidth = width + Math.sin(x/30) * curve * width;
    ctx.lineTo(x, y); ctx.stroke();
  };
  const end = () => setDrawing(false);
  const download = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = "maggilicious-noodles.png"; a.click();
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90 font-semibold"><Palette size={18}/><span>Noodle Doodle</span></div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/60">Width</label>
          <input type="range" min={2} max={20} value={width} onChange={(e)=>setWidth(+e.target.value)} />
          <label className="text-xs text-white/60">Wiggle</label>
          <input type="range" min={0} max={1} step={0.05} value={curve} onChange={(e)=>setCurve(+e.target.value)} />
          <GhostButton onClick={()=>{const ctx=canvasRef.current.getContext("2d"); ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);}}><Trash2 size={16}/>Clear</GhostButton>
          <GhostButton onClick={download}><Download size={16}/>PNG</GhostButton>
        </div>
      </div>
      <div
        className="mt-4 h-56 rounded-2xl bg-neutral-950/80 border border-white/10 overflow-hidden"
        onMouseDown={(e)=>start(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        onMouseMove={(e)=>move(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={(e)=>{const r=e.currentTarget.getBoundingClientRect(); const t=e.touches[0]; start(t.clientX-r.left, t.clientY-r.top)}}
        onTouchMove={(e)=>{const r=e.currentTarget.getBoundingClientRect(); const t=e.touches[0]; move(t.clientX-r.left, t.clientY-r.top)}}
        onTouchEnd={end}
      >
        <canvas ref={canvasRef} className="w-full h-full"/>
      </div>
      <p className="mt-3 text-xs text-white/60">Scribble steam curls, swirls, and noodle loops. Save your masterpiece!</p>
    </Card>
  );
}

function CravingsChart() {
  const data = useMemo(() => Array.from({length:24}, (_,h)=>({
    h: `${h}:00`,
    cravings: Math.round(40 + 30*Math.sin((h-2)/3) + (Math.random()*8-4) + (h>21||h<3? 25:0))
  })), []);
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-white/90 font-semibold"><Flame size={18}/> Cravings Heat‑Curve</div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.7}/>
                <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false}/>
            <XAxis dataKey="h" tick={{ fill: "#bbb", fontSize: 11 }} tickMargin={8}/>
            <YAxis tick={{ fill: "#bbb", fontSize: 11 }} tickMargin={4} width={30}/>
            <Tooltip contentStyle={{ background:"rgba(0,0,0,0.8)", border:"1px solid rgba(255,255,255,0.1)", borderRadius: 12, color:"#fff" }}/>
            <Area type="monotone" dataKey="cravings" stroke="#fbbf24" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-white/60">Our unofficial science: cravings spike after 10pm and around noon. We don't argue with data.</p>
    </Card>
  );
}

// ---------- Recipe Lab ----------
const BASES = ["Wavy", "Flat", "Rice", "Soba", "Udon", "Glass"];
const BROTHS = ["Classic salty", "Tangy tomato", "Cheesy butter", "Ginger-garlic", "Coconut curry", "Miso + chilli"];
const HEATS = ["Mild", "Medium", "Spicy", "Dragon"];
const MIXINS = ["Corn", "Peas", "Bell pepper", "Onion", "Spring onion", "Garlic chips", "Paneer", "Tofu", "Egg", "Chicken", "Sausage", "Mushroom", "Spinach"];

function RecipeLab() {
  const [base, setBase] = useState("Wavy");
  const [broth, setBroth] = useState("Classic salty");
  const [heat, setHeat] = useState("Medium");
  const [mix, setMix] = useState(["Spring onion", "Corn"]);
  const [saved, setSaved] = useLocalStorage("maggilicious.recipes", []);

  const randomize = () => {
    const r = (arr) => arr[Math.floor(Math.random()*arr.length)];
    setBase(r(BASES)); setBroth(r(BROTHS)); setHeat(r(HEATS));
    const m = [...MIXINS].sort(()=>Math.random()-0.5).slice(0, 3);
    setMix(m);
  };

  const recipe = useMemo(() => {
    const heatNote = {
      Mild: "gentle & cozy",
      Medium: "comfortably warm",
      Spicy: "sniffly good",
      Dragon: "absolute chaos (you asked)",
    }[heat];
    return {
      title: `${base} noodles · ${broth} · ${heat}`,
      steps: [
        `Boil 400ml water. Add ${base.toLowerCase()} noodles; cook 2.5–3.5 min to your liking`,
        `Whisk broth: ${broth} with a spoon of noodle water; add to pot`,
        `Stir in ${mix.join(", ")} for the last 45–60s`,
        `Finish with a knob of butter or a drizzle of sesame oil; sprinkle spring onion`,
      ],
      vibe: `Mood: ${heatNote}. Serve in a warm bowl, put on lo‑fi beats, and slurp.`,
      nutritionish: { energy: 520 + mix.length*10, protein: 12 + (mix.includes("Egg")?6:0) },
      mix,
      base, broth, heat,
      ts: Date.now(),
    };
  }, [base, broth, heat, mix]);

  const save = () => setSaved((s) => [recipe, ...s].slice(0, 30));
  const copy = async () => {
    const text = `${recipe.title}\n\n` + recipe.steps.map((s,i)=>`${i+1}. ${s}`).join("\n") + `\n\n${recipe.vibe}`;
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/90 font-semibold"><Wand2 size={18}/> Noodle Lab</div>
          <div className="flex gap-2">
            <GhostButton onClick={randomize}><Sparkles size={16}/> Surprise me</GhostButton>
            <GhostButton onClick={save}><Clipboard size={16}/> Save</GhostButton>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <Picker label="Base" options={BASES} value={base} onChange={setBase} />
          <Picker label="Broth" options={BROTHS} value={broth} onChange={setBroth} />
          <Picker label="Heat" options={HEATS} value={heat} onChange={setHeat} />
          <MultiPick label="Mix‑ins" options={MIXINS} value={mix} onChange={setMix} />
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-2">{recipe.title}</h3>
          <ol className="list-decimal list-inside space-y-1 text-white/80">
            {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <p className="mt-3 text-amber-200/90">{recipe.vibe}</p>
          <div className="mt-3 text-xs text-white/60">~{recipe.nutritionish.energy} kcal • protein ~{recipe.nutritionish.protein}g</div>
          <div className="mt-4 flex gap-2">
            <Button onClick={copy}><Clipboard size={16}/> Copy steps</Button>
            <GhostButton onClick={()=>{
              const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `maggilicious-recipe-${new Date(recipe.ts).toISOString()}.json`; a.click(); URL.revokeObjectURL(url);
            }}><Download size={16}/> JSON</GhostButton>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/90 font-semibold"><Star size={18}/> Saved Creations</div>
          <div className="text-xs text-white/50">local only</div>
        </div>
        <div className="mt-4 grid gap-3 max-h-[22rem] overflow-auto pr-1">
          {saved.length === 0 && <div className="text-white/60 text-sm">No saved bowls yet. Hit <em>SURPRISE ME</em> then <em>SAVE</em>!</div>}
          {saved.map((r, idx) => (
            <div key={r.ts+idx} className="rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.title}</div>
                <button onClick={()=>setSaved(saved.filter((x)=>x!==r))} className="text-white/60 hover:text-white"><Trash2 size={16}/></button>
              </div>
              <div className="mt-1 text-xs text-white/60">{new Date(r.ts).toLocaleString()}</div>
              <div className="mt-2 text-sm text-white/80">Mix‑ins: {r.mix.join(", ")}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Picker({ label, options, value, onChange }) {
  return (
    <div>
      <div className="text-xs text-white/60 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} onClick={()=>onChange(o)} className={cn("px-3 py-1.5 text-sm rounded-full border transition", value===o ? "bg-amber-400 text-neutral-900 border-amber-300" : "border-white/10 text-white/80 hover:text-white")}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function MultiPick({ label, options, value, onChange }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((x)=>x!==o) : [...value, o]);
  return (
    <div>
      <div className="text-xs text-white/60 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} onClick={()=>toggle(o)} className={cn("px-3 py-1.5 text-sm rounded-full border transition", value.includes(o) ? "bg-amber-400 text-neutral-900 border-amber-300" : "border-white/10 text-white/80 hover:text-white")}>{o}</button>
        ))}
      </div>
    </div>
  );
}

// ---------- Mini Game ----------
function CatchTheNoods() {
  const [running, setRunning] = useState(false);
  const [noods, setNoods] = useState([]);
  const [score, setScore] = useState(0);
  const areaRef = useRef(null);
  useEffect(() => { if (!running) return; const id = setInterval(() => {
    setNoods((ns) => (ns.length > 12 ? ns.slice(2) : ns).concat({ id: Math.random(), x: Math.random()*90+5, y: -10, v: 1.2+Math.random()*2 }));
  }, 600); return () => clearInterval(id); }, [running]);
  useEffect(() => { if (!running) return; const id = setInterval(() => {
    setNoods((ns) => ns.map((n) => ({ ...n, y: n.y + n.v })) .filter((n) => n.y < 120));
  }, 30); return () => clearInterval(id); }, [running]);
  const hit = (id) => { setNoods((ns)=>ns.filter((n)=>n.id!==id)); setScore((s)=>s+1); };
  const reset = () => { setRunning(false); setNoods([]); setScore(0); };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90 font-semibold"><Gamepad2 size={18}/> Catch the Noods</div>
        <div className="flex gap-2">
          <Button onClick={()=>setRunning((r)=>!r)}>{running? <><Pause size={16}/> Pause</>: <><Play size={16}/> Play</>}</Button>
          <GhostButton onClick={reset}><RotateCcw size={16}/> Reset</GhostButton>
        </div>
      </div>
      <div ref={areaRef} className="relative mt-4 h-64 rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 overflow-hidden">
        {noods.map((n) => (
          <button key={n.id} onClick={()=>hit(n.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: n.x + "%", top: n.y + "%" }}
            aria-label="noodle"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-400 text-neutral-900 font-black shadow">
              🍜
            </span>
          </button>
        ))}
        {!running && <div className="absolute inset-0 grid place-items-center text-white/70">Tap Play</div>}
      </div>
      <div className="mt-3 text-sm text-white/80">Score: <span className="font-bold">{score}</span> · Tip: noodles speed up over time!</div>
    </Card>
  );
}

// ---------- Shop (fake) ----------
const PRODUCTS = [
  { id: 1, name: "Midnight Chili Oil", price: 8, desc: "Crisp bits, smoky heat, tiny umami bombs.", badge: "bestseller" },
  { id: 2, name: "Slurp‑Proof Bowl", price: 18, desc: "Stoneware with a comfy thumb notch.", badge: "limited" },
  { id: 3, name: "Noodle Jammies", price: 28, desc: "Ridiculously cozy. Ridiculously noodles.", badge: "new" },
];

function Shop() {
  const [cart, setCart] = useLocalStorage("maggilicious.cart", []);
  const add = (p) => setCart((c) => [...c, p]);
  const total = cart.reduce((s,p)=>s+p.price,0);
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {PRODUCTS.map((p) => (
        <Card key={p.id} className="p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white">{p.name}</div>
            <Badge>{p.badge}</Badge>
          </div>
          <div className="mt-3 h-32 rounded-xl bg-gradient-to-br from-amber-300/20 to-rose-400/20 border border-white/10 grid place-items-center text-5xl">🍜</div>
          <div className="mt-3 text-white/80 text-sm flex-1">{p.desc}</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-white font-semibold">${p.price}</div>
            <Button onClick={()=>add(p)}><ShoppingBag size={16}/> Add</Button>
          </div>
        </Card>
      ))}
      <Card className="p-5 md:col-span-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/90 font-semibold"><ShoppingCart size={18}/> Cart</div>
          <div className="text-white/70 text-sm">Items: {cart.length} · Total: <span className="font-semibold">${total}</span></div>
        </div>
        <div className="mt-3 grid gap-2">
          {cart.length===0 ? <div className="text-white/60 text-sm">Your cart is empty. Add something tasty.</div> : cart.map((p,i)=>(
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
              <div className="text-white/90">{p.name}</div>
              <div className="flex items-center gap-3">
                <div className="text-white/70">${p.price}</div>
                <button onClick={()=>setCart(cart.filter((_,idx)=>idx!==i))} className="text-white/60 hover:text-white"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 text-white/80">
        <div>
          <div className="flex items-center gap-3"><NoodleLogo size={36}/><div className="text-lg font-black text-white">maggilicious</div></div>
          <p className="mt-2 text-sm">Made with cozy vibes, late‑night laughs, and a dash of chilli oil.</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white mb-2">Hours</div>
          <div>Mon–Thu · 6pm–1am</div>
          <div>Fri–Sat · 6pm–3am</div>
          <div>Sun · 6pm–12am</div>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white mb-2">Newsletter</div>
          <NewsletterForm />
        </div>
      </div>
      <div className="text-center text-xs text-white/50 pb-8">© {new Date().getFullYear()} maggilicious.com · All tiny joys reserved.</div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <div className="flex gap-2">
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@midnight.com" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-amber-300/50"/>
      <Button onClick={()=>{ if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ localStorage.setItem("maggilicious.sub", email); setOk(true);} }}>
        {ok? <Heart size={16}/> : <Sparkles size={16}/>} {ok? "Thanks!" : "Join"}
      </Button>
    </div>
  );
}

// ---------- Menu Preview ----------
function MenuPreview() {
  const items = [
    { name: "Butter‑Garlic Classic", icon: "🧄", desc: "Silky, garlicky, hits like a hug" },
    { name: "Tomato Tango", icon: "🍅", desc: "Tangy spoon‑licker with basil bits" },
    { name: "Curry Cloud", icon: "🥥", desc: "Coconut, ginger, mellow heat" },
    { name: "Firecracker", icon: "🌶️", desc: "Crunchy chilli oil, smoky crisp" },
    { name: "Miso Cozy", icon: "🍜", desc: "Deep umami, spring onion rain" },
    { name: "Cheese Party", icon: "🧀", desc: "Guilty? Nah. Grate more." },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.name} className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white">{it.name}</div>
            <div className="text-2xl">{it.icon}</div>
          </div>
          <div className="mt-2 text-sm text-white/70">{it.desc}</div>
        </Card>
      ))}
    </div>
  );
}

// ---------- About / Community ----------
function Testimonials() {
  const quotes = [
    ["Bliss in a bowl. The Doodle alone is therapy.", "M."],
    ["Timer set to Soupy. Heart set to Cozy.", "R."],
    ["Caught 42 noods. Ate 0. Worth it.", "A."],
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {quotes.map(([q, a], i) => (
        <Card key={i} className="p-5">
          <div className="text-white/80">“{q}”</div>
          <div className="mt-3 text-xs text-white/50">— {a}</div>
        </Card>
      ))}
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [dark, setDark] = useLocalStorage("maggilicious.theme.dark", true);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header onToggleMenu={()=>setMenuOpen(true)} dark={dark} setDark={setDark} />
      <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)} />
      <Hero />

      <main className="mx-auto max-w-7xl px-4">
        {/* MENU */}
        <section id="menu" className="pt-4">
          <div className="flex items-center gap-3 mb-4"><UtensilsCrossed className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">Menu Classics</h2></div>
          <MenuPreview />
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><SoupIcon/><h2 className="text-2xl font-black tracking-tight">Experience</h2></div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <BoilTimer />
              <DoodleCanvas />
            </div>
            <CravingsChart />
          </div>
        </section>

        {/* LAB */}
        <section id="lab" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><Wand2 className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">The Noodle Lab</h2></div>
          <RecipeLab />
        </section>

        {/* GAME */}
        <section id="game" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><Gamepad2 className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">Tiny Game</h2></div>
          <CatchTheNoods />
        </section>

        {/* COMMUNITY */}
        <section id="community" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><Heart className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">Community Whispers</h2></div>
          <Testimonials />
        </section>

        {/* SHOP */}
        <section id="shop" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><ShoppingBag className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">Tiny Shop</h2></div>
          <Shop />
        </section>

        {/* ABOUT */}
        <section id="about" className="pt-12">
          <div className="flex items-center gap-3 mb-4"><Sparkles className="text-amber-400"/><h2 className="text-2xl font-black tracking-tight">About</h2></div>
          <Card className="p-6">
            <p className="text-white/80">
              Maggilicious began as a late‑night experiment: what if a website felt like the moment you crack open a comfort snack? Warm, inviting, a bit silly—but thoughtfully crafted.
              We blend playful micro‑apps (timers, doodles, tiny games) with an actually handy recipe lab. Stay for a bowl, leave with a smile.
            </p>
            <p className="mt-3 text-white/60 text-sm">Disclaimer: This is a fictional, joyful internet place. No real orders—just real cozy.</p>
          </Card>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function SoupIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 border border-amber-300/30">
      <SoupSvg />
    </span>
  );
}
function SoupSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10h16a6 6 0 11-12 0" stroke="#fbbf24" strokeWidth="1.5"/>
      <path d="M6 6c.5 1 0 2-1 3M12 5c.5 1 0 2-1 3M18 6c.5 1 0 2-1 3" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
