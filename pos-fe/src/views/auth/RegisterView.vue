<template>
    <div class="h-screen flex justify-center items-center font-roboto relative p-4">
        <div class="flex flex-col w-full gap-y-4 p-6 box-border lg:w-2/5 sm:w-3/4">
            <div class="w-full space-y-1">
                <Title tag="h1">
                    Sign in
                </Title>
                <h1>Masuk untuk membuat akun baru</h1>
            </div>
            <form @submit.prevent="submit" class="w-full flex flex-col gap-y-4">
                <TextInput label="username" v-model="formModel.username"
                    :error-message="v$.username.$error ? v$.username.$errors : null" />
                <TextInput label="email" v-model="formModel.email"
                    :error-message="v$.email.$error ? v$.email.$errors : null" />
                <TextInput type="password" label="password" v-model="formModel.password"
                    :error-message="v$.password.$error ? v$.password.$errors : null" />
                <BaseButton size="full" type="submit">
                    <template #title-btn>
                        Submit
                    </template>
                </BaseButton>
                <div class="flex justify-between">
                    <RouterLink to="/">
                        <BaseButton size="auto" type="button" type-btn="danger">
                            <template #title-btn>
                                <Icon icon="heroicons:arrow-left-solid" />
                            </template>
                        </BaseButton>
                    </RouterLink>
                    <RouterLink :to="{ name: 'login' }" class="text-end group text-sm">
                        Already have account? <span class="group-hover:underline font-medium">Login</span>
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Title from '@/components/atom/Title.vue';
import TextInput from '@/components/atom/TextInput.vue';
import { ref, reactive, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import BaseButton from '@/components/atom/BaseButton.vue';

interface DataLogin {
    username: string,
    email: string,
    password: string
}

const formModel: DataLogin = reactive({
    username: '',
    email: '',
    password: '',
})

const rules = computed(() => ({
    email: {
        required,
        email
    },
    password: {
        required,
        minLength: minLength(8)
    },
    username: {
        required,
        minLength: minLength(4)
    }
}))

const v$ = useVuelidate(rules, formModel)

const submit = () => {
    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }
}
</script>
