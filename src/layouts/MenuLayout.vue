<template>
  <v-layout>
    
    <v-app-bar color="surface-variant" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="font-weight-bold">
        BBJ <span class="text-primary">Jiu-Jitsu</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex flex-column text-right me-4">
        <span class="text-subtitle-2 font-weight-bold">{{ userName }}</span>
        <span class="text-caption text-medium-emphasis text-uppercase">{{ userRole }}</span>
      </div>

      <v-btn icon="mdi-logout" color="error" @click="handleLogout" title="Sign Out"></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
      <v-list-item 
        prepend-avatar="https://vuetifyjs.com"
        title="Main Academy"
        subtitle="Management System"
        class="pa-4"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list nav v-model:opened="openedGroups">
        <v-list-item 
          prepend-icon="mdi-account-tie" 
          :title="$t('menu.instructors')" 
          to="/instructors" 
          value="instructors"
        ></v-list-item>
       
        <v-list-item 
          v-if="canSeeStudents"
          prepend-icon="mdi-account-group" 
          :title="$t('menu.students')" 
          to="/students" 
          value="students"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-medal" 
          :title="$t('menu.techniques')"
          to="/techniques" 
          value="techniques"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-google-classroom" 
          :title="$t('menu.methodologies')"
          to="/methodologies" 
          value="methodologies"
        ></v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-main style="min-height: 100vh;" class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>

  </v-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const userName = ref('User')
const userRole = ref('ALUNO')
const router = useRouter()

onMounted(() => {
  const savedUser = localStorage.getItem('user_token')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    userName.value = user.name || 'User'
    userRole.value = user.role || 'ALUNO'
  }
})

const canSeeStudents = computed(() => {
  return userRole.value === 'OWNER' || userRole.value === 'PROFESSOR'
})

const handleLogout = () => {
  localStorage.removeItem('user_token')
  router.push('/login')
}
</script>