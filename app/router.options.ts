import type { RouterConfig } from '@nuxt/schema'

const WORD_HASH = '#word-'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Статья #word-* открывается и закрывается в боковой панели — страницу не прокручиваем
    if (to.hash.startsWith(WORD_HASH)) return false
    if (from.hash.startsWith(WORD_HASH) && !to.hash) return false
    // Смена ?q=…&group=… в словаре — тоже без прокрутки
    const queryChanged = JSON.stringify(to.query) !== JSON.stringify(from.query)
    if (queryChanged && to.hash === from.hash && to.path === from.path) return false
    // Якорь секции (в том числе повторный клик по тому же якорю)
    if (to.hash) {
      const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { el: to.hash, behavior: reduced ? 'auto' : 'smooth' }
    }
    return { top: 0 }
  }
}
