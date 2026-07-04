<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('students.import.title')"
      :subtitle="$t('students.import.subtitle')"
      back="/students"
    />

    <v-row>
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <v-row>
            <v-col cols="12" sm="7">
              <v-file-input
                v-model="selectedFile"
                show-size
                accept=".xlsx, .xls"
                :label="$t('students.import.import_file')"
                prepend-icon="mdi-microsoft-excel"
                hide-details
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex justify-start align-self-center text-sm-right">
              <v-btn prepend-icon="mdi-cloud-upload" color="success" @click="uploadFile" class="w-100" :loading="loadingUpload" :disabled="!selectedFile">
                {{ $t('students.import.charge_file') }}
              </v-btn>
            </v-col>
            <v-col cols="12" sm="3" class="d-flex justify-end align-self-center text-sm-right">
              <v-btn prepend-icon="mdi-download" variant="outlined" color="primary" :loading="loadingTemplate" @click="downloadTemplateFile">
                {{ $t('students.import.model_xlsx') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card border flat class="pa-6 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-subtitle-1 font-weight-medium">
              Linhas processadas: <span class="font-weight-bold">{{ students.length }}</span> 
              (Válidas: <span class="text-success font-weight-bold">{{ validRowsCount }}</span>)
            </div>
            <v-chip v-if="hasErrors" color="error" variant="tonal" prepend-icon="mdi-alert-circle">
              Corrija os erros na planilha antes de salvar
            </v-chip>
          </div>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">
                  {{ $t('students.import.list.header_name') }}
                </th>
                <th class="text-left">
                  {{ $t('students.import.list.header_birth_date') }}
                </th>
                <th class="text-left">
                  {{ $t('students.import.list.header_belt_name') }}
                </th>
                <th class="text-left">
                  {{ $t('students.import.list.header_degree') }}
                </th>
                <th class="text-left">
                  {{ $t('students.import.list.header_status') }}
                </th>
                <th class="text-left">
                  {{ $t('students.import.list.header_errors') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in students"
                :key="item.id"
              >
                <td>{{ item.name }}</td>
                <td>{{ formatarData(item.birthDate) }}</td>
                <td>{{ item.beltName }}</td>
                <td>{{ item.degree }}</td>
                <td>
                  <v-chip v-if="item.isValid" color="success" size="small" variant="tonal" prepend-icon="mdi-check-circle">
                    Válido
                  </v-chip>
                  <v-chip v-else color="error" size="small" variant="tonal" prepend-icon="mdi-alert-circle">
                    Erro
                  </v-chip>
                </td>
                <td style="max-width: 250px;">
                  <div class="d-flex flex-column gap-1 text-wrap text-break">
                    <span 
                      v-for="(error, index) in item.errors" 
                      :key="index" 
                      class="d-flex align-start text-caption lh-sm py-0.5"
                    >
                      <v-icon icon="mdi-circle-small" size="16" class="me-1 mt-0.5 flex-shrink-0"></v-icon> 
                      <span>{{ error }}</span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
            <div class="d-flex justify-end mt-6">
              <v-btn 
                color="primary" 
                variant="flat" 
                class="px-6 font-weight-bold"
                :loading="loadingSave"
                :disabled="hasErrors || students.length === 0"
                @click="submitImport"
              >
                {{ $t('students.import.save') }}
              </v-btn>
            </div>
        </v-card>
      </v-col>
    </v-row>
  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import Cabecalho from '@/components/Cabecalho.vue'
import api from '@/plugins/axios'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useDateFormatter } from '@/composables/useDateFormatter';

const router = useRouter()
const { formatarData } = useDateFormatter();

const selectedFile = ref(null)
const students = ref([])
const hasErrors = ref(false)
const validRowsCount = ref(0)

const loadingTemplate = ref(false)
const loadingUpload = ref(false)
const loadingSave = ref(false)

const downloadTemplateFile = async () => {
  loadingTemplate.value = true
  try {
    const response = await api.get('/students/import/template', {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'modelo_importacao_alunos.xlsx'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Modelo baixado com sucesso!')
  } catch (error) {
    toast.error('Falha ao baixar o arquivo modelo.')
  } finally {
    loadingTemplate.value = false
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  loadingUpload.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await api.post('/students/import/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    students.value = response.data.data.students
    hasErrors.value = response.data.data.hasErrors
    validRowsCount.value = response.data.data.validRowsCount
    
    if (hasErrors.value) {
      toast.warning('Planilha processada, mas contém inconsistências.')
    } else {
      toast.success('Todos os dados da planilha estão válidos!')
    }
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Falha ao processar arquivo.')
  } finally {
    loadingUpload.value = false
  }
}

const submitImport = async () => {
  if (hasErrors.value || students.value.length === 0) return

  loadingSave.value = true

  const payload = {
    students: students.value.map(item => ({
      name: item.name,
      birthDate: item.birthDate,
      beltId: item.beltId,
      degree: item.degree
    }))
  }

  try {
    await api.post('/students/import/commit', payload)
    toast.success('Alunos importados em massa com sucesso!')
    router.push('/students')
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Erro ao efetivar a importação.')
  } finally {
    loadingSave.value = false
  }
}

</script>