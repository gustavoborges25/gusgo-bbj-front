<template>
  <MenuLayout>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2 text-grey-darken-3">
            {{ $t('dashboard.welcome') }}
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            {{ $t('dashboard.overview') }}
          </p>
        </div>
        
        <!-- Seletor rápido de idioma para você testar a engrenagem -->
        <v-btn-toggle v-model="currentLang" mandatory color="primary" variant="outlined" density="compact" @update:model-value="toggleLanguage">
          <v-btn value="pt-BR">PT</v-btn>
          <v-btn value="en">EN</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="4">
        <v-card border flat class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-overline text-medium-emphasis">{{ $t('dashboard.active_students') }}</div>
              <div class="text-h4 font-weight-bold">142</div>
            </div>
            <v-avatar color="primary-lighten-5" rounded size="large">
              <v-icon color="primary" icon="mdi-account-group" size="large"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)

const toggleLanguage = (lang) => {
  locale.value = lang
}
</script>
