<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="form.name"
        :label="$t('students.form.name')"
        :rules="nameRules"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-date-input
        v-model="form.birthDate"
        :label="$t('students.form.birth_date')"
        prepend-icon="$calendar"
        variant="outlined"
        :rules="birthDateRules"
        clearable
      ></v-date-input>
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
        :label="$t('students.form.degrees')"
        :rules="degreeRules"
        variant="outlined"
        type="number"
        min="0"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      <v-textarea
        v-model="form.notes"
        :label="t('students.form.notes.label')"
        :placeholder="t('students.form.notes.placeholder')"
        variant="outlined"
        color="primary"
      ></v-textarea>
    </v-col>
  </v-row>
  <v-row v-if="isEdit" class="mt-0">
    <v-col cols="12">
      <v-switch
        v-model="form.active"
        color="success"
        :label="form.active ? $t('students.actions.inactive') : $t('students.actions.active')"
        hide-details
      ></v-switch>
    </v-col>
  </v-row>

  <div class="d-flex justify-end mt-6">
    <v-btn variant="text" color="grey-darken-1" to="/students" class="me-2">
      {{ $t('students.form.cancel') }}
    </v-btn>
    <v-btn 
      type="submit" 
      color="primary" 
      variant="flat" 
      class="px-6 font-weight-bold"
      :loading="loading"
      :disabled="!isValid"
    >
      {{ $t('students.form.save') }}
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
  isValid: { type: Boolean, default: false }
})

const form = defineModel({ type: Object, required: true })

const nameRules = [v => !!v || t('students.validation.name_required')]
const beltRules = [v => !!v || t('students.validation.belt_required')]
const degreeRules = [v => v >= 0 || t('students.validation.degree_negative')]
const birthDateRules = [
  (v) => {
    if (!v) return true;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(v);
    dataSelecionada.setHours(0, 0, 0, 0);
    return dataSelecionada < hoje || t('students.validation.birth_date_invalid');
  }
]
</script>