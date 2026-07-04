<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="form.name"
        :label="$t('techniques.form.name')"
        :rules="nameRules"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="form.description"
        :label="t('techniques.form.description')"
        variant="outlined"
        color="primary"
      ></v-textarea>
    </v-col>

    <v-col cols="12">
      <!-- Corrigido: Removido type="password" para o link ficar visível -->
      <v-text-field
        v-model="form.videoUrl"
        :label="$t('techniques.form.video_url')"
        variant="outlined"
        placeholder="https://youtube.com..."
        clearable
      ></v-text-field>
    </v-col>
  </v-row>

  <v-row v-if="isEdit" class="mt-0">
    <v-col cols="12">
      <v-switch
        v-model="form.active"
        color="success"
        :label="form.active ? $t('techniques.actions.inactive') : $t('techniques.actions.active')"
        hide-details
      ></v-switch>
    </v-col>
  </v-row>

  <div class="d-flex justify-end mt-6">
    <v-btn variant="text" color="grey-darken-1" to="/techniques" class="me-2">
      {{ $t('techniques.form.cancel') }}
    </v-btn>
    <v-btn 
      type="submit" 
      color="primary" 
      variant="flat" 
      class="px-6 font-weight-bold"
      :loading="loading"
      :disabled="!isValid"
    >
      {{ $t('techniques.form.save') }}
    </v-btn>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue';

const { t } = useI18n()

defineProps({
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  isValid: { type: Boolean, default: false }
})

const form = defineModel({ type: Object, required: true })

const nameRules = [v => !!v || t('techniques.validation.name_required')]
</script>