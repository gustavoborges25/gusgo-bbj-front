<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="form.name"
        :label="$t('instructors.form.name')"
        :rules="nameRules"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-text-field
        v-model="form.email"
        :label="$t('instructors.form.email')"
        :rules="emailRules"
        :disabled="isEdit" 
        variant="outlined"
        type="email"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-text-field
        v-model="form.password"
        :label="isEdit ? $t('instructors.form.password_edit') : $t('instructors.form.password')"
        :rules="isEdit ? [] : passwordRules" 
        variant="outlined"
        type="password"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <BeltSelect
        v-model="form.beltId"
        :rules="beltRules"
      />
    </v-col>

    <v-col cols="12" sm="6">
      <v-text-field
        v-model.number="form.degree"
        :label="$t('instructors.form.degrees')"
        :rules="degreeRules"
        variant="outlined"
        type="number"
        min="0"
        required
      ></v-text-field>
    </v-col>
  </v-row>

  <v-row v-if="isEdit" class="mt-0">
    <v-col cols="12">
      <v-switch
        v-model="form.active"
        color="success"
        :label="form.active ? $t('instructors.actions.inactive') : $t('instructors.actions.active')"
        hide-details
      ></v-switch>
    </v-col>
  </v-row>

  <div class="d-flex justify-end mt-6">
    <v-btn variant="text" color="grey-darken-1" to="/instructors" class="me-2">
      {{ $t('instructors.form.cancel') }}
    </v-btn>
    <v-btn 
      type="submit" 
      color="primary" 
      variant="flat" 
      class="px-6 font-weight-bold"
      :loading="loading"
      :disabled="!isValid"
    >
      {{ $t('instructors.form.save') }}
    </v-btn>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BeltSelect from '@/components/BeltSelect.vue'

const { t } = useI18n()

defineProps({
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  isValid: { type: Boolean, default: false } // Recebe o estado do validador do pai
})

// O defineModel vincula diretamente o v-model do pai sem precisar de Watchers manuais criadores de loops
const form = defineModel({ type: Object, required: true })

const nameRules = [v => !!v || t('instructors.validation.name_required')]
const emailRules = [
  v => !!v || t('instructors.validation.email_required'),
  v => /.+@.+\..+/.test(v) || t('instructors.validation.email_invalid')
]
const passwordRules = [
  v => !!v || t('instructors.validation.password_required'),
  v => (v && v.length >= 6) || t('instructors.validation.password_short')
]
const beltRules = [v => !!v || t('instructors.validation.belt_required')]
const degreeRules = [v => v >= 0 || t('instructors.validation.degree_negative')]
</script>