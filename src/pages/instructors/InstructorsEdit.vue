<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('instructors.edit.title')"
      :subtitle="$t('instructors.edit.subtitle')"
      back="/instructors"
    />

    <v-row v-if="loadingFetch" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <v-form v-model="isFormValid" @submit.prevent="submitForm">
            <InstructorForm 
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
import InstructorForm from '@/components/InstructorForm.vue'
import api from '@/plugins/axios'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

const loadingFetch = ref(false)
const loadingSubmit = ref(false)
const isFormValid = ref(false)
const instructorId = route.params.id

const form = ref({
  name: '',
  email: '',
  password: '',
  beltId: null,
  degree: 0,
  active: true
})

const fetchInstructorData = async () => {
  loadingFetch.value = true
  try {
    const response = await api.get(`/instructors/${instructorId}`)
    const data = response.data.data
    
    form.value = {
      name: data.name,
      email: data.email,
      password: '', // Mantém limpo na edição
      beltId: data.beltId,
      degree: data.degree,
      active: data.active ?? true // Garante fallback booleano
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load instructor data.')
  } finally {
    loadingFetch.value = false
  }
}

const submitForm = async () => {
  if (!isFormValid.value) return
  
  loadingSubmit.value = true
  try {
    await api.put(`/instructors/${instructorId}`, form.value)
    router.push('/instructors')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update instructor.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(() => {
  fetchInstructorData()
})
</script>