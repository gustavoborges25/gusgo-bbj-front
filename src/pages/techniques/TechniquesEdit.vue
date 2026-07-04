<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('techniques.edit.title')"
      :subtitle="$t('techniques.edit.subtitle')"
      back="/techniques"
    />

    <v-row v-if="loadingFetch" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <v-form v-model="isFormValid" @submit.prevent="submitForm">
            <TechniqueForm 
              v-model="form" 
              is-edit 
              :loading="loadingSubmit" 
              :is-valid="isFormValid"
            />
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import Cabecalho from '@/components/Cabecalho.vue'
import TechniqueForm from '@/pages/techniques/TechniquesForm.vue'
import api from '@/plugins/axios'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

const loadingFetch = ref(false)
const loadingSubmit = ref(false)
const isFormValid = ref(false)
const techniqueId = route.params.id

const form = ref({
  name: '',
  description: '',
  videoUrl: '',
  active: true
})

const fetchTechniqueData = async () => {
  loadingFetch.value = true
  try {
    const response = await api.get(`/techniques/${techniqueId}`)
    const data = response.data.data
    
    form.value = {
      name: data.name,
      description: data.description,
      videoUrl: data.videoUrl,
      active: data.active ?? true // Garante fallback booleano
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load technique data.')
  } finally {
    loadingFetch.value = false
  }
}

const submitForm = async () => {
  if (!isFormValid.value) return
  
  loadingSubmit.value = true
  try {
    await api.put(`/techniques/${techniqueId}`, form.value)
    router.push('/techniques')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update technique.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(() => {
  fetchTechniqueData()
})
</script>