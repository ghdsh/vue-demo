import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'gongdan_theme'

function applyTheme(dark: boolean) {
  const html = document.documentElement
  html.setAttribute('data-theme', dark ? 'dark' : 'light')
  // Element Plus dark mode is triggered by class="dark" on <html>
  html.classList.toggle('dark', dark)
}

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

  function toggle() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
})

/** Call once before app mount to avoid flash of wrong theme */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) ?? 'light'
  applyTheme(saved === 'dark')
}
