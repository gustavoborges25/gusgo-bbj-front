<template>
  <!-- v-layout inicializa a estrutura de grids do Vuetify -->
  <v-layout>
    
    <!-- 1. BARRA DE TOPO (Header) -->
    <v-app-bar color="surface-variant" elevation="1">
      <!-- Botão que alterna a abertura/fechamento do menu lateral -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="font-weight-bold">
        BBJ <span class="text-primary">Jiu-Jitsu</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Informações do usuário logado -->
      <div class="d-none d-sm-flex flex-column text-right me-4">
        <span class="text-subtitle-2 font-weight-bold">{{ userName }}</span>
        <span class="text-caption text-medium-emphasis text-uppercase">{{ userRole }}</span>
      </div>

      <!-- Botão de Logout -->
      <v-btn icon="mdi-logout" color="error" @click="handleLogout" title="Sign Out"></v-btn>
    </v-app-bar>

    <!-- 2. MENU LATERAL (Sidebar) -->
    <v-navigation-drawer v-model="drawer" permanent>
      <!-- Cabeçalho interno do menu (pode ser o logo da academia) -->
      <v-list-item 
        prepend-avatar="https://vuetifyjs.com"
        title="Main Academy"
        subtitle="Management System"
        class="pa-4"
      ></v-list-item>

      <v-divider></v-divider>

      <!-- Lista de Links de Navegação -->
      <v-list nav>
        <v-list-item 
          prepend-icon="mdi-view-dashboard" 
          title="Dashboard" 
          to="/dashboard"
          value="dashboard"
        ></v-list-item>
        
        <v-list-item 
          prepend-icon="mdi-account-group" 
          title="Students" 
          to="/students" 
          value="students"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-account-tie" 
          title="Instructors" 
          to="/instructors" 
          value="instructors"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-google-classroom" 
          title="Classes & Attendance" 
          to="/classes" 
          value="classes"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-medal" 
          title="Belts & Curriculum" 
          to="/curriculum" 
          value="curriculum"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 3. CONTEÚDO PRINCIPAL (Onde as telas internas serão injetadas) -->
    <v-main style="min-height: 100vh;" class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <!-- O Vue Router vai renderizar a tela específica aqui dentro -->
        <slot />
      </v-container>
    </v-main>

  </v-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const userName = ref('User')
const userRole = ref('ALUNO')
const router = useRouter()

onMounted(() => {
  // Recupera os dados salvos no login para exibir no cabeçalho
  const savedUser = localStorage.getItem('user_token')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    userName.value = user.name || 'User'
    userRole.value = user.role || 'ALUNO'
  }
})

const handleLogout = () => {
  localStorage.removeItem('user_token')
  router.push('/login')
}
</script>