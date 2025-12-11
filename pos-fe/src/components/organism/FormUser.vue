<template>
    <Transition name="fade">
        <Overlay class="z-50 flex justify-center items-center backdrop-blur-sm" v-if="isShowForm">
            <form @submit.prevent="submit"
                class="bg-white p-6 flex flex-col gap-y-4 w-[90%] sm:w-3/5 lg:w-1/2 rounded-md lg:p-10 sm:p-8">
                <div class="inline-flex justify-between max-h-8">
                    <Title tag="h1">{{ isUpdate ? 'Update Worker' : 'Create Worker' }}</Title>
                    <BaseButton @click="closeForm" type="button" size="auto" type-btn="danger">
                        <template #title-btn>
                            <Icon icon="heroicons:x-mark-16-solid" />
                        </template>
                    </BaseButton>
                </div>
                <TextInput :disabled="isLoading" label="username" v-model="payload.username"
                    :error-message="v$.username.$error ? v$.username.$errors : null" />
                <TextInput :disabled="isLoading" label="email" v-model="payload.email"
                    :error-message="v$.email.$error ? v$.email.$errors : null" />
                <TextInput :disabled="isLoading" label="password" type="password" v-model="payload.password"
                    :error-message="v$.password.$error ? v$.password.$errors : null" />
                <div class="w-full">
                    <select class="border border-black/20 hover:outline-1 p-2 outline-0 rounded-md w-full"
                        v-model="payload.roleId">
                        <option value="" disabled>Choose role</option>
                        <option :value="role.id" v-for="role in roles" class="capitalize">
                            {{ role.name }}
                        </option>
                    </select>
                    <small v-if="v$.roleId.$error" class="text-red-700">
                        <span v-for="error of v$.roleId.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </span>
                    </small>
                </div>
                <BaseButton type="submit" :type-btn="isUpdate ? 'info' : 'cta'">
                    <template #title-btn>
                        <span v-if="!isLoading">
                            {{ isUpdate ? 'Update' : 'Submit' }}
                        </span>
                        <span v-else class="flex justify-center">
                            <Spinner size="xs" />
                        </span>
                    </template>
                </BaseButton>
            </form>
        </Overlay>
    </Transition>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref, Ref, Transition, watch } from 'vue';
import Overlay from '../atom/Overlay.vue';
import TextInput from '../atom/TextInput.vue';
import useVuelidate from '@vuelidate/core';
import BaseButton from '../atom/BaseButton.vue';
import Title from '../atom/Title.vue';

const props = defineProps<{
    updateUser: Pick<WorkerPayload, 'username' | 'email' | 'roleId'>,
    isUpdate: boolean
}>()

import { required, email, minLength } from '@vuelidate/validators';
import { workerStore } from '@/stores/workerStore';
import { userStore } from '@/stores/userStore';
import { Role } from '@/types/role';
import Spinner from '../atom/Spinner.vue';
import { WorkerPayload } from '@/types/payloads/auth';

const storeWorker = workerStore()
const storeUser = userStore()

const emits = defineEmits<{
    done : []
}>()

const roles = inject<Role[]>('roles')
const isLoading = ref<boolean>(false)
const isShowForm: Ref = inject('isShowForm')

const rules = computed(() => ({
    username: {
        required,
        minLength: minLength(4)
    },
    email: {
        required,
        email
    },
    password: {
        required,
        minLength: minLength(8)
    },
    roleId: {
        required
    }

}))

const closeForm = () => {
    isShowForm.value = false
    v$.value.$reset()
    Object.assign(payload, {
        username: '',
        email: '',
        password: '',
        roleId: '',
    })
}

const payload = reactive({
    username: '',
    email: '',
    password: '',
    roleId: '',
    businessId: storeUser.userBusiness.id
})

const v$ = useVuelidate(rules, payload)

const submit = async () => {
    v$.value.$touch()
    if (v$.value.$error) {
        return
    }
    isLoading.value = true
    try {
        await storeWorker.createWorker(payload)
    } finally {
        isLoading.value = false
        closeForm()
        emits('done')
    }

}

watch(() => props.isUpdate, () => {
    if (props.isUpdate) {
        Object.assign(payload, {
            username: props.updateUser.username,
            email: props.updateUser.email,
            roleId: props.updateUser.roleId
        })
    }
})

</script>
