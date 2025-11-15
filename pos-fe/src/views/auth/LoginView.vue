<template>
    <div class="h-screen flex justify-center items-center font-roboto relative p-4">
        <div class="flex flex-col w-full gap-y-4 p-6 box-border lg:w-2/5 sm:w-3/4">
            <div class="w-full space-y-1">
                <Title tag="h1">
                    Log in
                </Title>
                <h1>Masuk untuk akses aplikasi</h1>
            </div>
            <form @submit.prevent="submit" class="w-full flex flex-col gap-y-4">
                <TextInput label="email" v-model="formModel.email"
                    :error-message="v$.email.$error ? v$.email.$errors : null" />
                <TextInput type="password" label="password" v-model="formModel.password"
                    :error-message="v$.password.$error ? v$.password.$errors : null" />
                <div class="flex flex-row items-center gap-x-2 text-xs">
                    <label for="worker" class="order-2 cursor-pointer">
                        Isi kotak ini bila anda pekerja
                    </label>
                    <input type="checkbox" name="worker" id="worker" class="w-4 h-4">
                </div>
                <BaseButton size="full" type="submit">
                    <template #title-btn>
                        Submit
                    </template>
                </BaseButton>
                <div class="flex justify-between">
                    <RouterLink to="#" class="text-end hover:underline underline-offset-2 text-sm">
                        Forgot password ?
                    </RouterLink>
                    <RouterLink :to="{ name: 'register' }" class="text-end group text-sm">
                        Don't have account? <span class="group-hover:underline font-medium">Register</span>
                    </RouterLink>
                </div>
                <RouterLink to="/">
                    <BaseButton size="auto" type="button" type-btn="danger">
                        <template #title-btn>
                            <Icon icon="heroicons:arrow-left-solid" />
                        </template>
                    </BaseButton>
                </RouterLink>
            </form>
        </div>
        <Transition name="fade">
            <Overlay v-if="isLoading">
                <div class="w-full h-full flex justify-center items-center backdrop-blur-xs">
                    <Spinner fill-colors="yellow"/>
                </div>
            </Overlay>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import Title from '@/components/atom/Title.vue';
import TextInput from '@/components/atom/TextInput.vue';
import { ref, reactive, computed, onMounted, Ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import BaseButton from '@/components/atom/BaseButton.vue';
import { userStore } from '@/stores/userStore';
import { DataLogin } from '@/types/payloads/auth';
import { useRouter } from 'vue-router';
import Overlay from '@/components/atom/Overlay.vue';
import Spinner from '@/components/atom/Spinner.vue';

const router = useRouter()
const isLoading: Ref<boolean> = ref(false)

const formModel: DataLogin = reactive({
    email: '',
    password: ''
})

const rules = computed(() => ({
    email: {
        required,
        email
    },
    password: {
        required,
        minLength: minLength(8)
    }
}))

const v$ = useVuelidate(rules, formModel)
const storeUser = userStore()

const submit = async () => {
    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }
    isLoading.value = !isLoading.value
    try {
        await storeUser.userLogin(formModel)
        
        router.push({
            name: 'dashboard'
        })
    } catch (error: any) {
        console.log(error);
    } finally {
        isLoading.value = !isLoading.value
    }
}

onMounted(() => {
    console.log(storeUser.token);

})
</script>
