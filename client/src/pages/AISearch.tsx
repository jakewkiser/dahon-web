// client/src/pages/AISearch.tsx
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { localSearch } from "../lib/search"

type Row = ReturnType<typeof localSearch>[number]

// Uniform size applied to every character including the mascot
const CHAR_CLASS = "w-10 h-14 sm:w-14 sm:h-16 flex-shrink-0"

// ---------------------------------------------------------------------------
// Plant character components — all rendered at CHAR_CLASS dimensions
// ---------------------------------------------------------------------------

function MiniCactus() {
  return (
    <motion.svg
      viewBox="0 0 44 64"
      className={CHAR_CLASS}
      animate={{ rotate: [-9, 9, -9] }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center bottom" }}
    >
      <rect x="10" y="52" width="24" height="12" rx="3" fill="#C4956A" />
      <rect x="8" y="48" width="28" height="7" rx="3" fill="#D4A978" />
      <rect x="15" y="18" width="14" height="33" rx="7" fill="#5FBF94" />
      <rect x="5" y="28" width="11" height="7" rx="3.5" fill="#4BAE7E" />
      <rect x="5" y="24" width="8" height="11" rx="4" fill="#5FBF94" />
      <rect x="28" y="32" width="11" height="7" rx="3.5" fill="#4BAE7E" />
      <rect x="31" y="28" width="8" height="11" rx="4" fill="#5FBF94" />
      <circle cx="19" cy="33" r="1.8" fill="var(--ink)" />
      <circle cx="25" cy="33" r="1.8" fill="var(--ink)" />
      <path d="M19 38 C 21 40, 23 40, 25 38" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="36" r="2.5" fill="#FF9EBB" opacity="0.6" />
      <circle cx="29" cy="36" r="2.5" fill="#FF9EBB" opacity="0.6" />
    </motion.svg>
  )
}

function WavingFern() {
  return (
    <motion.svg
      viewBox="0 0 40 60"
      className={CHAR_CLASS}
      animate={{ rotate: [-11, 11, -11] }}
      transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center bottom" }}
    >
      <path d="M20 56 C 20 50, 19 40, 20 10" stroke="#5FBF94" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="12" cy="44" rx="10" ry="4" fill="#8FD19E" transform="rotate(-38 12 44)" />
      <ellipse cx="28" cy="38" rx="10" ry="4" fill="#5FBF94" transform="rotate(38 28 38)" />
      <ellipse cx="11" cy="30" rx="9" ry="3.5" fill="#6CC97A" transform="rotate(-42 11 30)" />
      <ellipse cx="29" cy="25" rx="9" ry="3.5" fill="#4BAE7E" transform="rotate(42 29 25)" />
      <ellipse cx="13" cy="18" rx="7" ry="3" fill="#8FD19E" transform="rotate(-35 13 18)" />
      <ellipse cx="27" cy="14" rx="7" ry="3" fill="#5FBF94" transform="rotate(35 27 14)" />
    </motion.svg>
  )
}

function SpinningDaisy() {
  return (
    <motion.svg
      viewBox="0 0 44 44"
      className={CHAR_CLASS}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center center" }}
    >
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="22" cy="10" rx="4.5" ry="8" fill="#FFD166" opacity="0.9"
          transform={`rotate(${a} 22 22)`} />
      ))}
      <circle cx="22" cy="22" r="8" fill="#8FD19E" />
      <circle cx="22" cy="22" r="5" fill="#4BAE7E" />
      <circle cx="20" cy="21" r="1.2" fill="var(--ink)" />
      <circle cx="24" cy="21" r="1.2" fill="var(--ink)" />
      <path d="M20 25 C 21 26.5, 23 26.5, 24 25" fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
    </motion.svg>
  )
}

function TinyTulip() {
  return (
    <motion.svg
      viewBox="0 0 36 58"
      className={CHAR_CLASS}
      animate={{ rotate: [-8, 8, -8] }}
      transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center bottom" }}
    >
      <rect x="4" y="48" width="28" height="10" rx="3" fill="#C4956A" />
      <rect x="2" y="44" width="32" height="6" rx="3" fill="#D4A978" />
      <line x1="18" y1="43" x2="18" y2="22" stroke="#5FBF94" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="11" cy="36" rx="9" ry="4" fill="#8FD19E" transform="rotate(-40 11 36)" />
      <ellipse cx="25" cy="30" rx="8" ry="3.5" fill="#5FBF94" transform="rotate(40 25 30)" />
      {/* tulip petals */}
      <path d="M18 22 C 11 20, 8 14, 10 8 C 13 4, 17 8, 18 22" fill="#FF8FAB" />
      <path d="M18 22 C 25 20, 28 14, 26 8 C 23 4, 19 8, 18 22" fill="#FF9EBB" />
      <path d="M18 22 C 15 12, 15 4, 18 2 C 21 4, 21 12, 18 22" fill="#FFB3C6" />
    </motion.svg>
  )
}

function PuffySucculent() {
  return (
    <motion.svg
      viewBox="0 0 48 56"
      className={CHAR_CLASS}
      animate={{ scaleY: [1, 1.12, 1], scaleX: [1, 0.92, 1] }}
      transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center bottom" }}
    >
      <rect x="10" y="47" width="28" height="9" rx="3" fill="#C4956A" />
      <rect x="8" y="43" width="32" height="7" rx="3" fill="#D4A978" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="24" cy="24" rx="7" ry="13" fill="#8FD19E" opacity="0.85"
          transform={`rotate(${a} 24 24) translate(0 -9)`} />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <ellipse key={a} cx="24" cy="24" rx="5" ry="9" fill="#5FBF94" opacity="0.9"
          transform={`rotate(${a} 24 24) translate(0 -6)`} />
      ))}
      <circle cx="24" cy="24" r="7" fill="#4BAE7E" />
      <circle cx="22.5" cy="23" r="1.2" fill="var(--ink)" />
      <circle cx="25.5" cy="23" r="1.2" fill="var(--ink)" />
    </motion.svg>
  )
}

function BouncySprout() {
  return (
    <motion.svg
      viewBox="0 0 36 60"
      className={CHAR_CLASS}
      animate={{ y: [0, -13, 0] }}
      transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="4" y="49" width="28" height="11" rx="4" fill="#C4956A" />
      <rect x="2" y="45" width="32" height="7" rx="3" fill="#D4A978" />
      <path d="M18 44 C 18 36, 16 28, 18 12" stroke="#5FBF94" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="10" cy="32" rx="9" ry="4.5" fill="#8FD19E" transform="rotate(-35 10 32)" />
      <ellipse cx="26" cy="25" rx="9" ry="4.5" fill="#5FBF94" transform="rotate(35 26 25)" />
      <ellipse cx="18" cy="11" rx="5" ry="8" fill="#6CC97A" />
      <circle cx="16" cy="11" r="1" fill="var(--ink)" />
      <circle cx="20" cy="11" r="1" fill="var(--ink)" />
      <path d="M16 15 C 17 16.5, 19 16.5, 20 15" fill="none" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />
    </motion.svg>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AISearch() {
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<Row[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const showParade = q.trim().length === 0
  const nav = useNavigate()

  useEffect(() => {
    if (q.trim().length < 2) {
      setRows([])
      return
    }
    const out = localSearch(q, 30)
    setRows(out)
  }, [q])

  function add(id: string | number, name: string, species?: string) {
    const params = new URLSearchParams()
    params.set("id", String(id))
    params.set("name", name)
    if (species) params.set("species", species)
    nav(`/add-plant?${params.toString()}`)
  }

  function cleanText(s?: string) {
    return (s || "").replace(/\s*\\([^)]*\\)/g, "").trim()
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight">Add Plant</h1>
        <p className="text-sm text-[var(--color-ink-subtle)]">Browse 100+ plant species and get a personalized care guide.</p>
      </div>

      {/* Search Card */}
      <Card className="p-6 glass" hover={false}>
        {/* Search bar with icon */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-ink-subtle)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <Input
              placeholder="Search by name, nickname, or type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-xl text-base pl-10 py-3"
            />
          </div>
          {q.trim().length > 0 && (
            <Button
              className="rounded-xl px-4 py-2 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 border border-white/10 transition-all animate-fadeIn"
              onClick={() => setQ("")}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Empty state hint */}
        {q.trim().length < 2 && (
          <p className="text-center opacity-60 text-sm mt-6">
            Start typing to find your plant.
          </p>
        )}

        {/* Character parade — visible whenever the search bar is empty */}
        <AnimatePresence>
          {showParade && (
            <motion.div
              className="flex justify-center items-end gap-1 sm:gap-3 pt-5 pb-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
            >
              {/* Left trio */}
              <MiniCactus />
              <WavingFern />
              <SpinningDaisy />

              {/* Primary mascot */}
              <motion.img
                src="/mascot_excited.svg"
                alt="Dahon mascot"
                className={`${CHAR_CLASS} object-contain drop-shadow-sm`}
                animate={{ rotate: [0, 360], y: [0, -14, 0] }}
                transition={{
                  duration: 1.6,
                  ease: "easeInOut",
                  rotate: { ease: "linear" },
                }}
              />

              {/* Right trio */}
              <TinyTulip />
              <PuffySucculent />
              <BouncySprout />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count */}
        {rows.length > 0 && (
          <p className="text-xs text-[var(--color-ink-subtle)] mt-6 mb-1">
            {rows.length} match{rows.length !== 1 ? "es" : ""} for{" "}
            <span className="font-medium text-[var(--color-ink-muted)]">"{q.trim()}"</span>
          </p>
        )}

        {/* Search results */}
        {rows.length > 0 && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rows.map((r, index) => {
              const id = r._localId
              const safeId = (r as any).id ?? id
              const isOpen = !!expanded[id]
              const summary = [cleanText(r.guide.water), cleanText(r.guide.light)]
                .filter(Boolean)
                .join(" • ")

              const imagePath =
                r.image && r.image.startsWith("/")
                  ? r.image
                  : `/plants_local_examples/${r.image}`

              return (
                <div
                  key={id}
                  className="rounded-2xl p-5 bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:shadow-glow hover:-translate-y-0.5"
                  style={{
                    animation: `fadeUp 0.3s ease-out ${(index * 0.03).toFixed(2)}s both`,
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <img
                      src={imagePath || "/placeholder-plant.jpg"}
                      alt={r.name}
                      loading="lazy"
                      className="w-28 h-28 object-contain rounded-xl bg-emerald-500/10 dark:bg-emerald-400/5 ring-1 ring-emerald-400/20 shadow-inner"
                    />
                    <div>
                      <div className="font-semibold text-base">{r.name}</div>
                      {r.species && (
                        <div className="text-xs italic opacity-60 mt-0.5">{r.species}</div>
                      )}
                      {summary && (
                        <div className="text-xs mt-1.5 opacity-70 leading-snug">{summary}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mt-5">
                    <Button
                      variant="primary"
                      className="text-sm px-4 py-1.5 rounded-lg"
                      onClick={() => add(safeId, r.name, r.species)}
                    >
                      Add Plant
                    </Button>
                    <button
                      className="text-xs px-4 py-1.5 rounded-lg border border-white/15 hover:bg-white/8 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all"
                      onClick={() => setExpanded((m) => ({ ...m, [id]: !m[id] }))}
                    >
                      {isOpen ? "Hide guide" : "View guide"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 animate-fadeIn">
                      {(["water", "light", "fertilizer"] as const).map((field) => {
                        const raw = r.guide?.[field] ?? ""
                        const clean = cleanText(raw)
                        const label =
                          field === "light" ? "☀️ Light"
                          : field === "water" ? "💧 Water"
                          : "🌿 Fertilizer"
                        return (
                          clean && (
                            <div key={field} className="flex gap-2 text-xs items-start">
                              <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 font-medium text-emerald-700 dark:text-emerald-300 leading-5">
                                {label}
                              </span>
                              <span className="opacity-75 leading-snug pt-0.5">{clean}</span>
                            </div>
                          )
                        )
                      })}

                      {r.sources && r.sources.length > 0 && (
                        <div className="pt-2">
                          <div className="text-xs opacity-50 mb-1">Sources</div>
                          <ul className="list-disc pl-5 text-xs space-y-0.5">
                            {r.sources.map((s, i) => (
                              <li key={i}>
                                <a
                                  className="underline hover:text-emerald-400 transition-colors"
                                  href={s.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {s.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* No match */}
        {rows.length === 0 && q.trim().length >= 2 && (
          <div className="text-center opacity-60 text-sm py-8">
            No matches found. Try a common name like "pothos" or "snake plant".
          </div>
        )}
      </Card>
    </div>
  )
}
