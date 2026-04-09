import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Role = 'admin' | 'user'

interface User {
  username: string
  role: Role
}

const MOCK_USERS: Array<User & { password: string }> = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user',  password: 'user123',  role: 'user' },
]

const SESSION_KEY = 'gongdan_auth'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  // Restore from sessionStorage on startup
  const saved = sessionStorage.getItem(SESSION_KEY)
  if (saved) {
    try {
      currentUser.value = JSON.parse(saved) as User
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }

  const isLoggedIn = computed(() => currentUser.value !== null)
  const role = computed(() => currentUser.value?.role ?? null)

  function login(username: string, password: string): boolean {
    const match = MOCK_USERS.find(
      u => u.username === username && u.password === password,
    )
    if (!match) return false
    currentUser.value = { username: match.username, role: match.role }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    return true
  }

  function logout(): void {
    currentUser.value = null
    sessionStorage.removeItem(SESSION_KEY)
  }

  return { currentUser, isLoggedIn, role, login, logout }
})
