const HASH_PREFIX = '#word-'

/**
 * Открытая словарная статья (Ф12, Ф13).
 * Единственный источник правды — хеш адреса `#word-<id>`: так статья
 * открывается по прямой ссылке и закрывается кнопкой «Назад».
 */
export function useWordArticle() {
  const route = useRoute()
  const router = useRouter()
  const { getWord } = useWords()

  const activeId = computed(() =>
    route.hash.startsWith(HASH_PREFIX) ? decodeURIComponent(route.hash.slice(HASH_PREFIX.length)) : null
  )
  const activeWord = computed(() => (activeId.value ? getWord(activeId.value) ?? null : null))

  function openWord(id: string) {
    router.push({ query: route.query, hash: `${HASH_PREFIX}${id}` })
  }

  function closeWord() {
    if (activeId.value) router.replace({ query: route.query, hash: '' })
  }

  return { activeId, activeWord, openWord, closeWord, wordHref: (id: string) => `${HASH_PREFIX}${id}` }
}
