<script setup lang="ts">
const { stats } = useWords()
const { activeId } = useWordArticle()

// Код статьи грузится только когда её впервые открыли (в т. ч. по ссылке #word-*)
const articleNeeded = ref(false)
onMounted(() => {
  watch(activeId, (id) => {
    if (id) articleNeeded.value = true
  }, { immediate: true })
})
const config = useRuntimeConfig()

const title = 'Баг или ошибка? Словарь IT-англицизмов'
const description = `Интерактивный словарь ${stats.total} англицизмов из речи IT-специалистов: значение, происхождение, русские формы и конкуренция с русскими аналогами.`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: 'ru_RU',
  ogUrl: config.public.siteUrl,
  ogImage: `${config.public.siteUrl}/og.png`,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <SectionsHero />
    <!-- Секции ниже первого экрана гидратируются лениво: их JS не мешает первой отрисовке -->
    <LazySectionsDuel hydrate-on-visible />
    <!-- Словарь интерактивен сразу: ввод в поиск до гидратации не должен теряться -->
    <SectionsDictionary />
    <LazySectionsGrammar hydrate-on-visible />
    <LazySectionsAssimilation hydrate-on-visible />
    <LazySectionsFindings hydrate-on-visible />
    <LazySectionsAbout hydrate-on-visible />
    <LazyWordArticle v-if="articleNeeded" />
  </div>
</template>
