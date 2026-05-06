import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'

function createDarkMode() {
  if (import.meta.env.MODE === 'test') {
    return { isDark: ref(false), toggleDark: () => {} }
  }
  const isDark = useDark()
  return { isDark, toggleDark: useToggle(isDark) }
}

export const { isDark, toggleDark } = createDarkMode()
