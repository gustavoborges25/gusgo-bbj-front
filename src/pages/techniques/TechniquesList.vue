<template>
  <MenuLayout>
    <Cabecalho 
      :title="$t('techniques.list.title')"
      :subtitle="$t('techniques.list.subtitle')"
      forwardRoute="/techniques/create"
      :forwardText="$t('techniques.add_button')"
    />
    <BaseDataTable
      :headers="headers"
      :items="techniques"
      :loading="loadingTable"
      :search-placeholder="$t('techniques.search_placeholder')"
    >
      <template #[`item.active`]="{ item }">
        <v-badge dot inline :color="item.active ? 'success' : 'error'">
          <span style="margin-right: 5px;">{{ item.active ? $t('techniques.status_active') : $t('techniques.status_inactive') }}</span>
        </v-badge>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn v-tooltip="$t('techniques.actions.edit')" icon="mdi-account-edit" size="small" variant="text" color="#ffc107" @click="handleEdit(item)"></v-btn>
        <v-btn v-tooltip="item.active ? $t('techniques.actions.inactive') : $t('techniques.actions.active')" icon="mdi-toggle-switch" size="small" variant="text" :color="item.active ? 'success' : 'grey'" @click="toggleStatus(item)"></v-btn>
        <v-btn v-tooltip="$t('techniques.actions.delete')" icon="mdi-delete" size="small" variant="text" color="error" @click="openDeleteModal(item)"></v-btn>
      </template>
    </BaseDataTable>

    <ConfirmDialog
      v-model="deleteModal"
      :loading="loadingDelete"
      :title="$t('techniques.delete.title')"
      :message="$t('techniques.delete.subtitle_1') + selectedName + $t('techniques.delete.subtitle_2')"
      :confirm-text="$t('techniques.delete.confirm')"
      color="error"
      icon="mdi-trash-can-outline"
      @confirm="handleDelete"
    />

  </MenuLayout>
</template>

<script setup>
import MenuLayout from '@/layouts/MenuLayout.vue'
import Cabecalho from '@/components/Cabecalho.vue'
import BaseDataTable from '@/components/BaseDataTable.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import api from '@/plugins/axios'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const techniques = ref([])
const loadingTable = ref(false)
const router = useRouter()
const deleteModal = ref(false)
const loadingDelete = ref(false)
const selectedId = ref(null)
const selectedName = ref(null)

const headers = computed(() => [
  { title: t('techniques.columns.name'), key: 'name', sortable: true },
  { title: t('techniques.columns.status'), key: 'active', sortable: true, align: 'center' },
  { title: t('techniques.actions.title'), key: 'actions', sortable: false, align: 'center' }
])

const fetchTechniques = async () => {
  loadingTable.value = true
  try {
    const response = await api.get('/techniques')
    techniques.value = response.data.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao carregar a lista de técnicas.')
  } finally {
    loadingTable.value = false
  }
}

const openDeleteModal = (technique) => {
  selectedId.value = technique.id
  selectedName.value = technique.name
  deleteModal.value = true
}

const toggleStatus = async (item) => {
  const originalStatus = item.active 

  try {
    const response = await api.patch(`/techniques/${item.id}`, {
      active: !originalStatus
    })

    const updatedTechnique = response.data.data
    item.active = updatedTechnique.active
    toast.success(t('techniques.edit.status'))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao mudar o status da técnica.')
    item.active = originalStatus
  }
}

const handleDelete = async () => {
  if (!selectedId.value) return

  loadingDelete.value = true
  try {
    await api.delete(`/techniques/${selectedId.value}`)
    deleteModal.value = false
    selectedId.value = null
    selectedName.value = null
    toast.success(t('techniques.delete.success'))
    fetchTechniques()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Falha ao excluir a técnica.')
  } finally {
    loadingDelete.value = false
  }
}

const handleEdit = (item) => {
  router.push(`/techniques/${item.id}`)
}

onMounted(() => { fetchTechniques() })
</script>