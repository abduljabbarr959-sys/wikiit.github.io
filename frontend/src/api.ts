import type { Entry, EntrySummary, User } from './types'

const API_ROOT = import.meta.env.VITE_API_URL || ''
const BASE = `${API_ROOT}/api/entries`
const AUTH = `${API_ROOT}/api/auth`

const CRED = API_ROOT ? 'include' as const : 'same-origin' as const

function getCSRFToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/)
  return match ? match[1] : ''
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'X-CSRFToken': getCSRFToken(),
    ...extra,
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body: Record<string, unknown> = await res.json().catch(() => ({}))
    if (typeof body.error === 'string') {
      throw new Error(body.error)
    }
    const firstField = Object.values(body).find((v): v is unknown[] => Array.isArray(v) && v.length > 0)
    if (firstField) {
      throw new Error(String(firstField[0]))
    }
    throw new Error(`Request failed (${res.status})`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, credentials: CRED })
}

export async function listEntries(search?: string): Promise<EntrySummary[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await apiFetch(`${BASE}/${params}`)
  if (!res.ok) return []
  const body = await res.json()
  if (Array.isArray(body)) return body as EntrySummary[]
  const results = (body as { results?: EntrySummary[] }).results
  return results ?? []
}

export async function getEntry(title: string): Promise<Entry> {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(title)}/`)
  return handleResponse<Entry>(res)
}

export async function createEntry(title: string, content: string): Promise<Entry> {
  const res = await apiFetch(`${BASE}/create/`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ title, content }),
  })
  return handleResponse<Entry>(res)
}

export async function updateEntry(title: string, content: string): Promise<Entry> {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(title)}/`, {
    method: 'PUT',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ content }),
  })
  return handleResponse<Entry>(res)
}

export async function deleteEntry(title: string): Promise<void> {
  const res = await apiFetch(`${BASE}/${encodeURIComponent(title)}/`, {
    method: 'DELETE',
    headers: headers(),
  })
  return handleResponse<void>(res)
}

export async function register(username: string, password: string): Promise<User> {
  const res = await apiFetch(`${AUTH}/register/`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<User>(res)
}

export async function login(username: string, password: string): Promise<User> {
  const res = await apiFetch(`${AUTH}/login/`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<User>(res)
}

export async function logout(): Promise<void> {
  const res = await apiFetch(`${AUTH}/logout/`, {
    method: 'POST',
    headers: headers(),
  })
  return handleResponse<void>(res)
}

export interface MeResponse {
  authenticated: boolean
  id?: number
  username?: string
}

export async function me(): Promise<MeResponse> {
  const res = await apiFetch(`${AUTH}/me/`)
  return handleResponse<MeResponse>(res)
}
