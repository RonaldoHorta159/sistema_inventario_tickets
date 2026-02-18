<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const isSidebarOpen = ref(true);
const authStore = useAuthStore();

const menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', to: '/app/dashboard' },
    { label: 'Inventario', icon: 'pi pi-box', to: '/app/inventario' },
    { label: 'Traslados', icon: 'pi pi-truck', to: '/app/traslados' },
    { label: 'Reportes', icon: 'pi pi-file-excel', to: '/app/reportes' },
    { label: 'Configuración', icon: 'pi pi-cog', to: '/app/configuracion' },
];

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const router = useRouter();
const logout = async () => {
    await authStore.logOut()
};
</script>

<template>
    <div class="min-h-screen flex bg-gray-50">

        <aside class="bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20"
            :class="isSidebarOpen ? 'w-64' : 'w-20'">
            <div class="h-16 flex items-center justify-center border-b border-gray-100">
                <i class="pi pi-database text-blue-600 text-2xl"></i>
                <span v-if="isSidebarOpen" class="ml-2 font-bold text-xl text-gray-800">Patrimonio</span>
            </div>

            <nav class="flex-1 py-4 px-2 space-y-1">
                <router-link v-for="(item, index) in menuItems" :key="index" :to="item.to"
                    class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    active-class="bg-blue-100 text-blue-700">
                    <i :class="[item.icon, 'text-lg']"></i>
                    <span v-if="isSidebarOpen" class="ml-3 font-medium">{{ item.label }}</span>

                    <div v-if="!isSidebarOpen"
                        class="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {{ item.label }}
                    </div>
                </router-link>
            </nav>

            <div class="p-4 border-t border-gray-100">
                <button @click="logout"
                    class="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <i class="pi pi-sign-out text-lg"></i>
                    <span v-if="isSidebarOpen" class="ml-3 font-medium">Salir</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-20'">

            <header
                class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                <div class="flex items-center">
                    <button @click="toggleSidebar"
                        class="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none">
                        <i class="pi pi-bars text-xl"></i>
                    </button>
                    <h2 class="ml-4 text-lg font-semibold text-gray-700">Sistema de Gestión</h2>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-3">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-bold text-gray-800">Jose Ronaldo</p>
                            <p class="text-xs text-gray-500">Administrador</p>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                            JR
                        </div>
                    </div>
                </div>
            </header>

            <main class="p-6">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </main>
        </div>

    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>