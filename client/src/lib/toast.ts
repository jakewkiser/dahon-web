// client/src/lib/toast.ts
// Lightweight imperative toast API using a simple pub-sub event bus.
// Usage: toast.success('Plant saved!') | toast.error('Something went wrong.')

export type ToastItem = {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

type Listener = (items: ToastItem[]) => void

let _items: ToastItem[] = []
let _nextId = 0
const _listeners = new Set<Listener>()

function notify() {
  const snapshot = [..._items]
  _listeners.forEach((l) => l(snapshot))
}

function add(type: ToastItem['type'], message: string, duration = 3500) {
  const id = ++_nextId
  _items = [..._items, { id, type, message }]
  notify()
  setTimeout(() => {
    _items = _items.filter((t) => t.id !== id)
    notify()
  }, duration)
}

export const toast = {
  success: (msg: string) => add('success', msg),
  error: (msg: string) => add('error', msg),
  info: (msg: string) => add('info', msg),
  subscribe: (fn: Listener): (() => void) => {
    _listeners.add(fn)
    return () => { _listeners.delete(fn) }
  },
}
