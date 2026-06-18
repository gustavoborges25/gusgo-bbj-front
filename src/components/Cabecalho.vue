<template>
    <v-row class="mb-4 align-center">
        <v-col cols="12" sm="8"  class="d-flex align-center">
            <v-btn
                v-if="back"
                icon="mdi-arrow-left" 
                variant="text" 
                color="grey-darken-2" 
                class="me-2"
                :to="back"
            ></v-btn>
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">
                    {{ title }}
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                    {{ subtitle }}
                </p>
            </div>
        </v-col>
        <v-col v-if="forwardRoute" cols="12" sm="4" class="text-sm-right">
            <v-btn 
                color="primary" 
                prepend-icon="mdi-account-plus" 
                size="large" 
                rounded="md" 
                elevation="1"
                :to="forwardRoute"
            >
                {{ forwardText }}
            </v-btn>
        </v-col>
    </v-row>
</template>   

<script setup>

defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    back: { type: String, default: '' },
    forwardRoute: { type: String, default: '' },
    forwardText: { type: String, default: '' }
})

</script>