<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('students.edit.title')"
      :subtitle="$t('students.edit.subtitle')"
      back="/students"
    />

    <v-row v-if="loadingFetch" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <v-form v-model="isFormValid" @submit.prevent="submitForm">
            <StudentForm 
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
import StudentForm from '@/components/StudentForm.vue'
import api from '@/plugins/axios'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

const loadingFetch = ref(false)
const loadingSubmit = ref(false)
const isFormValid = ref(false)
const studentId = route.params.id

const form = ref({
  name: '',
  birthDate: '',
  beltId: null,
  degree: 0,
  active: true,
  notes: ''
})

const fetchStudentsData = async () => {
  loadingFetch.value = true
  try {
    const response = await api.get(`/students/${studentId}`)
    const data = response.data.data
    
    form.value = {
      name: data.name,
      birthDate: data.birthDate,
      beltId: data.beltId,
      degree: data.degree,
      active: data.active ?? true, // Garante fallback booleano
      notes: data.notes,
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load student data.')
  } finally {
    loadingFetch.value = false
  }
}

const submitForm = async () => {
  if (!isFormValid.value) return
  
  loadingSubmit.value = true
  try {
    await api.put(`/students/${studentId}`, form.value)
    router.push('/students')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update students.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(() => { fetchStudentsData() })
</script>