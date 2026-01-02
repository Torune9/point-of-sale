<template>
    <div class="flex flex-col gap-y-4">
        <ConfirmModal :is-show-confirm="isShowConfirm" :message="modalMessage" @confirm="confirm" @close="closeModal" />
        <FormUser :is-update="isUpdate" :update-user="updateDataWorker" @done="done" />
        <div class="flex flex-row justify-between items-center gap-x-4">
            <div class="lg:w-1/2 w-full">
                <TextInput placeholder="search" v-model="search" class="w-1/2" />
            </div>
            <BaseButton @click="createUser">
                <template #title-btn>
                    Create
                </template>
            </BaseButton>
        </div>
        <div class="capitalize">
            <EasyTable :headers="headers" :items="items" table-class-name="customize-table" :search-field="searchField"
                :search-value="search" :rows-items="[10, 15]" :rows-per-page="10">
                <template #item-action="item">
                    <div class="flex flex-row gap-2">
                        <BaseButton size="auto" type="button" type-btn="info" @click.stop="updateWorker(item)">
                            <template #title-btn>
                                <Icon icon="heroicons:pencil-square-16-solid" class="text-sm" />
                            </template>
                        </BaseButton>
                        <BaseButton size="auto" type="button" type-btn="danger" @click.stop="deleteWorker(item)">
                            <template #title-btn>
                                <Icon icon="heroicons:trash-16-solid" class="text-sm" />
                            </template>
                        </BaseButton>
                    </div>
                </template>
            </EasyTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, watch } from 'vue';
import BaseButton from '@/components/atom/BaseButton.vue';
import TextInput from '@/components/atom/TextInput.vue';
import { Header, Item } from 'vue3-easy-data-table';
import FormUser from '@/components/organism/FormUser.vue';
import { roleStore } from '@/stores/roleStore';
import { Role } from '@/types/role';
import { workerStore } from '@/stores/workerStore';
import { userStore } from '@/stores/userStore';
import { Worker } from '@/types/worker';
import ConfirmModal from '@/components/atom/ConfirmModal.vue';

const storeWorker = workerStore()
const storeRoles = roleStore()
const storeUser = userStore()

const headers: Header[] = [
    {
        text: "username",
        value: "username"
    },
    {
        text: "email",
        value: "email"
    },
    {
        text: "role",
        value: "role.name"
    },
    {
        text: "action",
        value: "action"
    },
]

const items = ref<Item[]>([])

const search = ref('')
const searchField = ref('username')
const isShowForm = ref<boolean>(false)
provide('isShowForm', isShowForm)
const roles = ref<Role[]>()
provide('roles', roles)
const isLoading = ref<boolean>(false)
const isShowConfirm = ref<boolean>(false)

const createUser = () => {
    isUpdate.value = false
    isShowForm.value = true
}
const getWorkers = async () => {
    isLoading.value = true
    try {
        const response = await storeWorker.getWorkers(storeUser.userBusiness.id)
        items.value = response.result.data
    } finally {
        isLoading.value = false
    }
}
const getRoles = async () => {
    const response = await storeRoles.getRoles()
    roles.value = response.result.data
}
const isUpdate = ref<boolean>(false)

const updateDataWorker = ref({
    username: '',
    email: '',
    roleId: '',
    id : ''
})

const updateWorker = (worker: Worker) => {
    isShowForm.value = true
    isUpdate.value = true
    updateDataWorker.value = {
        id : worker.id,
        username: worker.username,
        email: worker.email,
        roleId: worker.role.id,
    }
}

const workerId = ref<string>('')
const modalMessage = ref<string>('')

const deleteWorker = async (worker: Worker) => {
    modalMessage.value = `Delete this user : ${worker.username}`
    isShowConfirm.value = true
    workerId.value = worker.id
}

const confirm = async () => {
    await Promise.all([
        await storeWorker.deleteWorker(storeUser.userBusiness.id, workerId.value),
        await getWorkers()
    ])
}
const done = async () => await getWorkers()

const closeModal = (data: boolean) => {
    isShowConfirm.value = data
}
watch(isShowForm, (val) => {
    if (!val) {
        isUpdate.value = false
    }
})
onMounted(async () => {
    await Promise.all([
        getRoles(),
        getWorkers()
    ])
})

</script>
