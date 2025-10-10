import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { aiSearchStatus, localSearch, getLocalGuideByName } from '../lib/search'

type Row = ReturnType<typeof localSearch>[number]

export default function AISearch() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const nav = useNavigate()
  const status = useMemo(() => aiSearchStatus(), [])

  useEffect(() => {
    if (q.trim().length < 2) {
      setRows([])
      return
    }
    const out = localSearch(q, 30)
    setRows(out)
  }, [q])

  function add(name: string, species?: string) {
    const params = new URLSearchParams()
    params.set('name', name)
    if (species) params.set('species', species)
    nav(`/add?${params.toString()}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">AI Search</h1>
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 dark:bg-white/5">
          {status}
        </div>
      </div>

      <Card>
        <div className="flex gap-2">
          <Input
            placeholder="Search plants by name (type 2+ letters)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1"
          />
          <Button className="text-ink" onClick={() => setQ('')}>Clear</Button>
        </div>

        {/* Results */}
        <div className="mt-4 space-y-3">
          {rows.length === 0 && q.trim().length === 0 && (
            <div className="opacity-70 text-sm">
              Start typing to search. Local dataset includes dozens of popular houseplants; Algolia will take over automatically when keys are present.
            </div>
          )}

          {rows.map((r) => {
            const id = r._localId
            const isOpen = !!expanded[id]
            const summary = `${r.guide.water} • ${r.guide.light}`
            return (
              <div key={id} className="rounded-2xl p-3 glass">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{r.name}</div>
                    {r.species && <div className="text-xs opacity-80">{r.species}</div>}
                    <div className="text-xs mt-1 opacity-90">{summary}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="text-ink" onClick={() => add(r.name, r.species)}>Add</Button>
                    <button
                      className="px-3 py-1.5 text-xs rounded-lg border border-white/10 hover:bg-white/5"
                      onClick={() => setExpanded((m) => ({ ...m, [id]: !m[id] }))}
                    >
                      {isOpen ? 'Hide guide' : 'View guide'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 text-sm space-y-1">
                    <div><span className="opacity-70">Water:</span> {r.guide.water}</div>
                    <div><span className="opacity-70">Light:</span> {r.guide.light}</div>
                    {r.guide.fertilizer && <div><span className="opacity-70">Fertilizer:</span> {r.guide.fertilizer}</div>}
                    {r.guide.notes && <div><span className="opacity-70">Notes:</span> {r.guide.notes}</div>}

                    {/* Sources */}
                    {r.sources && r.sources.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs opacity-70">Sources</div>
                        <ul className="list-disc pl-5 text-xs">
                          {r.sources.map((s, i) => (
                            <li key={i}>
                              <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
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
            <div className="opacity-70 text-sm">No results. Try another name.</div>
          )}
        </div>
      </Card>
    </div>
  )
}
