// client/src/pages/AISearch.tsx
import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { aiSearchStatus, localSearch } from '../lib/search'

type Row = ReturnType<typeof localSearch>[number]

export default function AISearch() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const nav = useNavigate()

  // 📊 Search status snapshot
  const status = useMemo(() => {
    try {
      const s = aiSearchStatus()
      if (!s) return '—'
      return `${s.provider} • ${s.count} plants • ${s.ready ? 'ready' : 'loading'}`
    } catch {
      return '—'
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

  // 🪴 Add plant (passes canonical ID + names)
  function add(id: string, name: string, species?: string) {
    const params = new URLSearchParams()
    params.set('id', id)
    params.set('name', name)
    if (species) params.set('species', species)
    nav(`/add-plant?${params.toString()}`)
  }

  // 🧽 Clean parenthetical notes
  function cleanText(s?: string) {
    return (s || '').replace(/\s*\([^)]*\)/g, '').trim()
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn space-y-6">
      {/* 🌿 Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/mascot_excited.svg"
            alt="Dahon mascot"
            className="w-7 h-7 rounded-md ring-1 ring-black/10 dark:ring-white/10 animate-bounce-slow"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Add Plant</h1>
        </div>
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 dark:bg-white/5">
          {status}
        </div>
      </div>

      {/* 🌸 Search Bar */}
      <Card className="p-5">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="🌱 Find your plant companion (type 2+ letters)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 rounded-xl text-base"
          />
          <Button
            className="rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition-all"
            onClick={() => setQ('')}
          >
            Clear
          </Button>
        </div>

        {/* 🌷 Search Results */}
        <div className="mt-5 space-y-4">
          {rows.length === 0 && q.trim().length === 0 && (
            <div className="text-center opacity-80 text-sm py-8">
              🪴 Start typing to explore Dahon’s living library of plant guides.  
              <br />
              Each plant comes with care wisdom and a little personality.
            </div>
          )}

          {rows.map((r, index) => {
            const id = r._localId
            const isOpen = !!expanded[id]
            const summary = [cleanText(r.guide.water), cleanText(r.guide.light)]
              .filter(Boolean)
              .join(' • ')

            return (
              <div
                key={r.id}
                className="rounded-2xl p-4 glass transition-all hover:-translate-y-0.5 hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-md"
                style={{
                  animation: `fadeUp 0.3s ease-out ${(index * 0.03).toFixed(2)}s both`
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-lg">{r.name}</div>
                    {r.species && (
                      <div className="text-xs opacity-80 italic">{r.species}</div>
                    )}
                    {summary && (
                      <div className="text-xs mt-1 opacity-90">{summary}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="text-ink text-sm px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all"
                      onClick={() => add(r.id, r.name, r.species)}
                    >
                      🌿 Add
                    </Button>
                    <button
                      className="px-3 py-1.5 text-xs rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                      onClick={() =>
                        setExpanded((m) => ({ ...m, [id]: !m[id] }))
                      }
                    >
                      {isOpen ? 'Hide guide' : 'View guide'}
                    </button>
                  </div>
                </div>

                {/* Expanded Care Details */}
                {isOpen && (
                  <div className="mt-3 text-sm space-y-1 animate-fadeIn">
                    {(['water', 'light', 'fertilizer'] as const).map((field) => {
                      const raw = r.guide?.[field] ?? ''
                      const clean = cleanText(raw)
                      const label =
                        field === 'light'
                          ? '☀️ Light'
                          : field === 'water'
                          ? '💧 Water'
                          : '🌿 Fertilizer'
                      return (
                        clean && (
                          <div key={field}>
                            <span className="opacity-70">{label}:</span> {clean}
                          </div>
                        )
                      )
                    })}

                    {/* Sources */}
                    {r.sources && r.sources.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs opacity-70">Sources</div>
                        <ul className="list-disc pl-5 text-xs space-y-0.5">
                          {r.sources.map((s, i) => (
                            <li key={i}>
                              <a
                                className="underline hover:text-green-400 transition-colors"
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
            <div className="text-center opacity-70 text-sm py-6">
              😔 No plants matched your search. Try a different name!
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
