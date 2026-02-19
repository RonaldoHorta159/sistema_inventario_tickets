<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estado para el menú móvil
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Menú de navegación (ACTUALIZADO: Ahora usa clases de PrimeIcons)
const menuItems = [
    { label: 'Panel Principal', icon: 'pi pi-home', to: '/app/dashboard' },
    { label: 'Inventario', icon: 'pi pi-box', to: '/app/inventario' },
    { label: 'Lista de bienes', icon: 'pi pi-id-card', to: '/app/inventario/InventarioLista' },
    { label: 'Movimientos', icon: 'pi pi-truck', to: '/app/movimientos' },
    { label: 'Búsqueda', icon: 'pi pi-search', to: '/app/busqueda' },
    { label: 'Reportes', icon: 'pi pi-chart-bar', to: '/app/reportes' },
    { label: 'Configuración', icon: 'pi pi-cog', to: '/app/configuracion' },
];

const logout = async () => {
    await authStore.logOut();
};

// Fecha actual para el header
const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
});
</script>

<template>
    <div
        class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark transition-colors duration-200">

        <aside
            class="flex flex-col bg-sidebar-dark text-white shadow-xl z-20 transition-all duration-300 fixed md:relative h-full"
            :class="isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'">
            <div class="flex h-16 items-center justify-center bg-black/20 border-b border-white/10 shadow-lg shrink-0">
                <div class="flex items-center space-x-2">
                    <i class="pi pi-truck text-secondary text-2xl"></i>
                    <span class="text-xl font-bold tracking-wide">SGIP <span
                            class="text-secondary text-sm font-normal">v2.0</span></span>
                </div>
            </div>

            <div class="px-4 py-6 border-b border-white/5 shrink-0">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-full border-2 border-primary shadow-sm bg-white/10 flex items-center justify-center text-lg font-bold">
                        {{ authStore.user?.user_metadata?.name?.charAt(0) || 'U' }}
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-sm font-medium text-white truncate">
                            {{ authStore.user?.user_metadata?.name || 'Usuario' }}
                        </p>
                        <p class="text-xs text-gray-400">Administrador</p>
                    </div>
                </div>
            </div>

            <nav class="flex-1 space-y-1 overflow-y-auto px-2 py-4 scrollbar-thin">
                <router-link v-for="(item, index) in menuItems" :key="index" :to="item.to"
                    class="group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200"
                    active-class="bg-primary/20 text-secondary shadow-inner border-l-4 border-secondary"
                    class-active="active"
                    :class="$route.path === item.to ? '' : 'text-gray-300 hover:bg-white/10 hover:text-white'">
                    <i
                        :class="[item.icon, 'mr-3 transition-colors text-lg', $route.path === item.to ? 'text-secondary' : 'text-gray-400 group-hover:text-secondary']"></i>
                    {{ item.label }}
                </router-link>
            </nav>

            <div class="p-4 bg-black/20 shrink-0">
                <button @click="logout"
                    class="w-full flex items-center justify-center space-x-2 rounded-md bg-white/5 py-2 px-4 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white hover:bg-red-900/30 transition-colors">
                    <i class="pi pi-sign-out text-lg"></i>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>

        <div class="flex flex-1 flex-col overflow-hidden relative w-full">

            <header
                class="bg-primary text-white shadow-md z-10 flex h-16 items-center justify-between px-6 transition-colors shrink-0">
                <div class="flex items-center md:hidden">
                    <button @click="toggleMobileMenu"
                        class="mr-4 text-white focus:outline-none hover:bg-white/10 p-1 rounded">
                        <i class="pi pi-bars text-xl"></i>
                    </button>
                    <span class="text-lg font-bold">SGIP</span>
                </div>

                <div class="hidden md:flex flex-col">
                    <h1 class="text-xl font-bold tracking-tight">Sistema de Gestión de Inventario Público</h1>
                    <span class="text-xs text-white/80">TRAMUSA S.A. - División de Transportes</span>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="relative hidden md:block">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i class="pi pi-search text-white/60"></i>
                        </span>
                        <input
                            class="w-64 rounded-full border-none bg-white/10 py-1.5 pl-10 pr-4 text-sm text-white placeholder-white/60 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-secondary sm:text-sm transition-all"
                            placeholder="Buscar activo..." type="text" />
                    </div>

                    <button
                        class="relative rounded-full p-1 text-white hover:bg-white/10 focus:outline-none transition-colors">
                        <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                        <i class="pi pi-bell text-xl"></i>
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-6 bg-background-light dark:bg-background-dark scroll-smooth">

                <div class="flex justify-between items-center mb-6">
                    <nav aria-label="Breadcrumb" class="flex">
                        <ol class="flex items-center space-x-2">
                            <li><a class="text-gray-400 hover:text-gray-500" href="#"><i class="pi pi-home"></i></a>
                            </li>
                            <li><span class="text-gray-300">/</span></li>
                            <li><span aria-current="page"
                                    class="text-sm font-medium text-primary dark:text-secondary capitalize">{{
                                        $route.name }}</span></li>
                        </ol>
                    </nav>
                    <div
                        class="hidden sm:flex text-sm text-text-muted-light dark:text-text-muted-dark font-medium items-center bg-card-light dark:bg-card-dark px-3 py-1 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                        <i class="pi pi-calendar text-secondary mr-2"></i>
                        <span>{{ currentDate }}</span>
                    </div>
                </div>

                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>

                <footer class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 pb-2 text-center">
                    <p class="text-xs text-text-muted-light dark:text-text-muted-dark">
                        © 2026 TRAMUSA S.A. Sistema de Gestión de Inventario Público (SGIP). Todos los derechos
                        reservados.
                    </p>
                </footer>
            </main>

            <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
                class="fixed inset-0 bg-black/50 z-10 md:hidden glass"></div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>