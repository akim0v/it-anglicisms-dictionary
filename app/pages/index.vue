<script setup lang="ts">
const { stats } = useWords()
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
    <SectionsDuel />
    <SectionsDictionary />
    <SectionsGrammar />
    <SectionsAssimilation />
    <SectionsFindings />
    <SectionsAbout />
    <WordArticle />
  </div>
</template>
