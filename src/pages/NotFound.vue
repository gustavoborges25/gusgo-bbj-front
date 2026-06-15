<template>
  <MenuLayout>
    <v-container class="fill-height text-center justify-center align-center" style="min-height: 70vh;">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          
          <!-- Ícone visual de erro/alerta -->
          <v-avatar color="error-lighten-5" size="120" class="mb-6">
            <v-icon icon="mdi-alert-circle-outline" color="error" size="64"></v-icon>
          </v-avatar>

          <!-- Título Dinâmico -->
          <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
            {{ $t('errors.not_found_title') }}
          </h1>

          <!-- Subtítulo / Descrição com piada interna de Jiu-Jitsu -->
          <p class="text-subtitle-1 text-medium-emphasis mb-6">
            {{ $t('errors.not_found_subtitle') }}
          </p>

          <!-- Botão para retornar à segurança da Home -->
          <v-btn
            color="primary"
            prepend-icon="mdi-home"
            size="large"
            rounded="md"
            elevation="1"
            to="/"
          >
            {{ $t('errors.back_home') }}
          </v-btn>

        </v-col>
      </v-row>
    </v-container>
  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
</script>