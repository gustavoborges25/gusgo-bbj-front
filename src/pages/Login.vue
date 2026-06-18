<template>
  <v-container class="fill-height bg-grey-lighten-3" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        
        <div class="text-center mb-6">
          <h1 class="text-h3 font-weight-black text-grey-darken-4">
            OSSO <span class="text-primary">Jiu-Jitsu</span>
          </h1>
          <p class="text-subtitle-2 text-medium-emphasis mt-1">{{ $t('app.subtitle') }}</p>
        </div>

        <v-card class="elevation-2 pa-4 rounded-lg" border flat>
          <v-card-title class="text-h5 font-weight-bold px-2 pt-2">
            {{ $t('login.title') }}
          </v-card-title>
          
          <v-card-text class="pt-4">

            <v-form v-model="isFormValid" @submit.prevent="handleLogin">
              
              <v-text-field
                v-model="email"
                :label="$t('login.email_label')"
                :rules="emailRules"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :label="$t('login.password_label')"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                required
              ></v-text-field>

              <v-btn 
                type="submit" 
                color="primary" 
                block 
                size="large"
                class="mt-4 font-weight-bold"
                :loading="loading"
                :disabled="!isFormValid"
              >
                {{ $t('login.submit_button') }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '@/plugins/axios'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const isFormValid = ref(false)

const emailRules = [
  v => !!v || t('login.validation.email_required'),
  v => /.+@.+\..+/.test(v) || t('login.validation.email_invalid')
]

const passwordRules = [
  v => !!v || t('login.validation.password_required')
]

const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  
  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    })

    const userData = response.data.data

    localStorage.setItem('user_token', JSON.stringify(userData))
    router.push('/')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha na autenticação!')
  } finally {
    loading.value = false
  }
}
</script>