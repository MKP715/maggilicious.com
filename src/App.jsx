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
"transition",
className
)}
{...props}
>
{children}
</button>
);
}


function Badge({ children, className = "" }) {
return (
<span
className={cn(
"inline-flex items-center rounded-full border border-amber-300/40",
"bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
"text-amber-200 shadow-sm shadow-amber-500/10",
className
)}
>
{children}
</span>
);
}
}
