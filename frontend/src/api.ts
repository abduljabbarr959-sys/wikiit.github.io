import type { Entry, EntrySummary, User } from './types'

const API_ROOT = import.meta.env.VITE_API_URL || ''
const BASE = `${API_ROOT}/api/entries`
const AUTH = `${API_ROOT}/api/auth`

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body: Record<string, unknown> = await res.json().catch(() => ({}))
    if (typeof body.error === 'string') {
      throw new Error(body.error)
    }
    const firstField = Object.values(body).find(v => Array.isArray(v) && v.length > 0)
    if (firstField) {
      throw new Error(String(firstField[0]))
    }
    throw new Error(`Request failed (${res.status})`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export async function listEntries(search?: string): Promise<EntrySummary[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${BASE}/${params}`)
  if (!res.ok) return []
  const body = await res.json()
  if (Array.isArray(body)) return body as EntrySummary[]
  const results = (body as { results?: EntrySummary[] }).results
  return results ?? []
}

export async function getEntry(title: string): Promise<Entry> {
  const res = await fetch(`${BASE}/${encodeURIComponent(title)}/`)
  return handleResponse<Entry>(res)
}

export async function createEntry(title: string, content: string): Promise<Entry> {
  const res = await fetch(`${BASE}/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  return handleResponse<Entry>(res)
}

export async function updateEntry(title: string, content: string): Promise<Entry> {
  const res = await fetch(`${BASE}/${encodeURIComponent(title)}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  return handleResponse<Entry>(res)
}

export async function deleteEntry(title: string): Promise<void> {
  const res = await fetch(`${BASE}/${encodeURIComponent(title)}/`, {
    method: 'DELETE',
  })
  return handleResponse<void>(res)
}

export async function register(username: string, password: string): Promise<User> {
  const res = await fetch(`${AUTH}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<User>(res)
}

export async function login(username: string, password: string): Promise<User> {
  const res = await fetch(`${AUTH}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<User>(res)
}

export async function logout(): Promise<void> {
  const res = await fetch(`${AUTH}/logout/`, { method: 'POST' })
  return handleResponse<void>(res)
}

export interface MeResponse {
  authenticated: boolean
  id?: number
  username?: string
}

export async function me(): Promise<MeResponse> {
  const res = await fetch(`${AUTH}/me/`)
  return handleResponse<MeResponse>(res)
}
