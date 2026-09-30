import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Статья #word-* открывается в боковой панели — страницу не прокручиваем
    if (to.hash.startsWith('#word-')) return false
    // Смена ?q=…&group=… в словаре — тоже без прокрутки
    if (to.hash === from.hash && to.path === from.path) return false
    if (to.hash) {
      const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { el: to.hash, behavior: reduced ? 'auto' : 'smooth' }
    }
    return { top: 0 }
  }
}
