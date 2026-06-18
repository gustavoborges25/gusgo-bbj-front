<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('instructors.create.title')"
      :subtitle="$t('instructors.create.subtitle')"
      back="/instructors"
    />

    <v-row >
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <v-form v-model="isFormValid" @submit.prevent="submitForm">
            <InstructorForm 
              v-model="form" 
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const loadingSubmit = ref(false)
const isFormValid = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  beltId: null,
  degree: 0,
  active: true
})

const submitForm = async () => {
  if (!isFormValid.value) return
  loadingSubmit.value = true

  try {
    await api.post('/instructors', form.value)
    router.push('/instructors')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create instructor.')
  } finally {
    loadingSubmit.value = false
  }
}
</script>