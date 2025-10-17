import { useEffect, useMemo, useState } from "react"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { aiSearchStatus, localSearch } from "../lib/search"

type Row = ReturnType<typeof localSearch>[number]

export default function AISearch() {
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<Row[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const nav = useNavigate()

  // 📊 Search status snapshot
  const status = useMemo(() => {
    try {
      const s: any = aiSearchStatus()
      if (!s) return "—"
      if (typeof s === "string") return s
      if (typeof s === "object" && "provider" in s)
        return `${s.provider} • ${s.count ?? "?"} plants • ${
          s.ready ? "ready" : "loading"
        }`
      return String(s)
    } catch {
      return "—"
    }
  }, [])

  // 🔍 Perform local search
  useEffect(() => {
    if (q.trim().length < 2) {
      setRows([])
      return
    }
    const out = localSearch(q, 30)
    setRows(out)
  }, [q])

  // 🌿 Add plant (passes canonical ID + names)
  function add(id: string | number, name: string, species?: string) {
    const params = new URLSearchParams()
    params.set("id", String(id))
    params.set("name", name)
    if (species) params.set("species", species)
    nav(`/add-plant?${params.toString()}`)
  }

  // 🧽 Clean parenthetical notes
  function cleanText(s?: string) {
    return (s || "").replace(/\s*\([^)]*\)/g, "").trim()
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
      {/* 🌿 Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Add Plant</h1>
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 dark:bg-white/5">
          {status}
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <Card className="p-6 glass">
        <div className="flex gap-3 items-center">
          <Input
            placeholder="🔎 Search your plant library (type 2+ letters)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 rounded-xl text-base"
          />
          <Button
            className="rounded-xl px-4 py-2 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            onClick={() => setQ("")}
          >
            Clear
          </Button>
        </div>

        {/* 🌱 Search Results */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rows.length === 0 && q.trim().length < 2 && (
            <div className="col-span-full text-center opacity-80 text-sm py-8">
              🌿 Start typing to explore Dahon’s living library of plant
              companions. Each one comes with care wisdom and personality.
            </div>
          )}

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
                className="rounded-2xl p-4 bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:shadow-glow hover:-translate-y-0.5"
                style={{
                  animation: `fadeUp 0.3s ease-out ${(index * 0.03).toFixed(
                    2
                  )}s both`,
                }}
              >
                {/* 🖼️ Image */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <img
                    src={imagePath || "/placeholder-plant.jpg"}
                    alt={r.name}
                    loading="lazy"
                    className="w-28 h-28 object-contain rounded-xl bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-inner"
                  />

                  <div>
                    <div className="font-medium text-base">{r.name}</div>
                    {r.species && (
                      <div className="text-xs italic opacity-75">
                        {r.species}
                      </div>
                    )}
                    {summary && (
                      <div className="text-xs mt-1 opacity-80 leading-snug">
                        {summary}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3 mt-4">
                  <Button
                    className="text-sm px-4 py-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 transition-all"
                    onClick={() => add(safeId, r.name, r.species)}
                  >
                    Add
                  </Button>
                  <button
                    className="text-xs px-4 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                    onClick={() =>
                      setExpanded((m) => ({ ...m, [id]: !m[id] }))
                    }
                  >
                    {isOpen ? "Hide guide" : "View guide"}
                  </button>
                </div>

                {/* Expanded Care Details */}
                {isOpen && (
                  <div className="mt-3 text-xs space-y-1 animate-fadeIn">
                    {(["water", "light", "fertilizer"] as const).map((field) => {
                      const raw = r.guide?.[field] ?? ""
                      const clean = cleanText(raw)
                      const label =
                        field === "light"
                          ? "☀️ Light"
                          : field === "water"
                          ? "💧 Water"
                          : "🌿 Fertilizer"
                      return (
                        clean && (
                          <div key={field}>
                            <span className="opacity-70">{label}:</span>{" "}
                            {clean}
                          </div>
                        )
                      )
                    })}

                    {r.sources && r.sources.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs opacity-70">Sources</div>
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

          {rows.length === 0 && q.trim().length >= 2 && (
            <div className="col-span-full text-center opacity-70 text-sm py-6">
              😔 No plants matched your search. Try a different name!
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
