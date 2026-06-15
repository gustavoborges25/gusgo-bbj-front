import { createI18n } from 'vue-i18n'
import ptBR from '@/locales/pt-BR.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  legacy: false, // 👈 Obrigatório para usar com a moderna Composition API (<script setup>)
  locale: 'pt-BR', // 👈 Idioma padrão inicial
  fallbackLocale: 'en', // 👈 Idioma de segurança caso falte alguma tradução em PT-BR
  messages: {
    'pt-BR': ptBR,
    'en': en
  }
})

export default i18n
