<template>
  <v-app>
    <Toaster position="top-right" closeButton richColors />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { Toaster } from 'vue-sonner'
  import 'vue-sonner/style.css' 
</script>
