/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
import { pt, en } from 'vuetify/locale'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
  },
  locale: {
    locale: 'pt',
    fallback: 'en',
    messages: { pt },
  },
  date: {
    locale: {
      pt: 'pt-BR',
      en: 'en-US'
    }
  },
})
