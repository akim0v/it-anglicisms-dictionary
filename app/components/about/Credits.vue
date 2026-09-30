<script setup lang="ts">
import { AUTHORS } from '~/data/project'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const siteLabel = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
</script>

<template>
  <dl class="grid gap-4 sm:grid-cols-2">
    <div class="rounded-lg border border-default p-4">
      <dt class="flex items-center gap-2 text-sm text-muted">
        <UIcon
          name="i-lucide-users"
          class="size-4 shrink-0"
          aria-hidden="true"
        />
        {{ AUTHORS.length === 1 ? 'Автор' : 'Авторы' }}
      </dt>
      <dd class="mt-2 font-semibold text-highlighted">
        <span
          v-for="author in AUTHORS"
          :key="author"
          class="block"
        >{{ author }}</span>
      </dd>
    </div>

    <div class="rounded-lg border border-default p-4">
      <dt class="flex items-center gap-2 text-sm text-muted">
        <UIcon
          name="i-lucide-globe"
          class="size-4 shrink-0"
          aria-hidden="true"
        />
        Адрес сайта
      </dt>
      <dd class="mt-2 min-w-0">
        <ULink
          :to="siteUrl"
          target="_blank"
          rel="noopener"
          class="font-semibold break-all text-primary underline-offset-2 hover:text-primary hover:underline"
        >
          {{ siteLabel }}
          <span class="sr-only">(откроется в новой вкладке)</span>
        </ULink>
      </dd>
    </div>
  </dl>
</template>
