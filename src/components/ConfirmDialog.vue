<template>
  <v-dialog v-model="isOpen" :max-width="maxWidth" persistent>
    <v-card class="pa-4 rounded-xl">
      <v-card-item class="pb-2">
        <div class="d-flex align-center">
          <!-- Ícone e cor dinâmicos -->
          <v-avatar :color="`${color}-lighten-5`" class="me-3" size="48">
            <v-icon :color="color" :icon="icon" size="26"></v-icon>
          </v-avatar>
          <div>
            <v-card-title class="text-h6 font-weight-bold pa-0 text-wrap">
              {{ title }}
            </v-card-title>
          </div>
        </div>
      </v-card-item>

      <v-card-text class="text-body-1 text-medium-emphasis py-3">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end pt-4">
        <v-btn
          variant="text"
          color="grey-darken-1"
          class="px-4 font-weight-medium"
          :disabled="loading"
          @click="isOpen = false"
        >
          {{ cancelText || $t('app.cancel') }}
        </v-btn>
        
        <!-- Botão principal dinâmico -->
        <v-btn
          :color="color"
          variant="flat"
          class="px-5 font-weight-bold rounded-lg"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmText: { type: String, required: true },
  cancelText: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
  icon: { type: String, default: 'mdi-help-circle-outline' }, // Ícone do MDI
  maxWidth: { type: String, default: '450px' }
})

const emit = defineEmits(['confirm'])
const isOpen = defineModel({ type: Boolean, default: false })

const onConfirm = () => {
  emit('confirm')
}
</script>
