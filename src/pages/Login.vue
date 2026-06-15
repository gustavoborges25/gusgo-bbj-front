<template>
  <v-container class="fill-height justify-center align-center">
    <v-card width="400" class="pa-6 text-center">
      <v-card-title class="text-h5">Jiu-Jitsu System</v-card-title>
      <v-card-text>This is the Login Page.</v-card-text>
      <!-- Botão simulando um login com sucesso para testar o guarda de rotas -->
      <v-btn color="primary" block @click="simulateLogin">Mock Sign In</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const simulateLogin = () => {
  // Salva um token fictício no localStorage
  localStorage.setItem('user_token', JSON.stringify({ name: 'Professor Afonso', role: 'PROFESSOR' }))
  router.push('/')
}
</script>